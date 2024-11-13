/* 
    Related Profiles Input Sort
    v10/text/html
    id: 7844

    Programmable Layout that reads in related profiles as JSON then sorts based on the nameSort node

    This was converted to a PL to allow srting by a custom node which cannot be done through a keyword search navigation
*/

try {

    let FullListOutputImports = JavaImporter(
        com.terminalfour.publish.utils.TreeTraversalUtils,
        com.terminalfour.spring.ApplicationContextProvider,
        com.terminalfour.content.IContentManager,
        com.terminalfour.version.Version,
        com.terminalfour.publish.utils.BrokerUtils,
        com.terminalfour.sitemanager.cache.CachedContent
    );

    with (FullListOutputImports) {


        // log function for console output
        log = message => document.write('<script>eval("console.log(\'' + message + '\')");</script>');



        
        /**
         * 
         *  Methods
         * 
         */

        function getCachedSectionFromId(sectionID) {
            if (typeof sectionID === 'undefined') {
                return section
            } else if (section.getID() == sectionID) {
                return section
            }
            sectionID = Number(sectionID)
            if (sectionID == 0) {
                throw 'Passed Incorrect Section ID to getCachedSectionFromId'
            }
            return TreeTraversalUtils.findSection(
                publishCache.getChannel(),
                section,
                sectionID,
                language
            )
        }

        function getContentManager() {
            return ApplicationContextProvider.getBean(
                IContentManager
            )
        }

        function getCachedContentFromId(contentID, contentVersion) {
            if (typeof contentID === 'undefined' && typeof contentVersion === 'undefined') {
                return content
            } else if (Number(contentID) <= 0 && typeof contentVersion !== 'undefined' && content !== null) {
                contentID = content.getID();
            } else {
                contentID = Number(contentID);
            }
            if (content === null && contentID === 0) {
                throw 'Passed Incorrect Content ID to getContentFromId'
            }
            let contentManager = getContentManager();
            if (typeof contentVersion !== 'undefined') {
                return contentManager.get(contentID, language, Version(contentVersion))
            } else {
                let version;
                if (isPreview) {
                    version = contentManager.get(contentID, language).version;
                } else {
                    version = contentManager.getLastApprovedVersion(contentID, language);
                }
                return contentManager.get(contentID, language, version);
            }
        }

        function processT4Tags(t4tag, contentID, sectionID, forMediaFile) {
            let cachedContent = content || null;
            let cachedSection = section;
            if (typeof sectionID !== 'undefined' && sectionID !== null && Number(sectionID) > 0) {
                cachedSection = getCachedSectionFromId(sectionID);
            }
            if (contentID === null && sectionID !== null) {
                cachedContent = null;
            } else if (typeof contentID !== 'undefined' && Number(contentID) > 0) {
                cachedContent = getCachedContentFromId(contentID);
                if (cachedContent == null) {
                    throw 'Could not get cachedContent';
                }
            }
            if (cachedSection == null) {
                throw 'Could not get cachedSection';
            }
            if (forMediaFile !== true) {
                forMediaFile = false;
            }
            let renderedHtml = String(BrokerUtils.processT4Tags(dbStatement, publishCache, cachedSection, cachedContent, language, isPreview, t4tag));
            if (forMediaFile) {
                renderedHtml = renderedHtml.replace(/&/gi, '&amp;');
            }
            return renderedHtml;
        }

        function processTags(t4Tag) {
            myContent = content || null;
            return String(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag));
        }



        /**
         * 
         *  Optional Elements
         * 
         */
        let optional = {

            primaryDept: processT4Tags('<t4 type="content" name="Primary Department" output="normal" display_field="value" />'),
            h2Heading: processTags('<t4 type="content" name="Heading" output="normal" modifiers="striptags,htmlentities" />'),
            generalDescription: processTags('<t4 type="content" name="General Description" output="normal" modifiers="nl2br" />')

        };

        /**
         * 
         *  Declarations
         * 
         */
        let profilesNav = '<t4 type="navigation" name="Related Profiles Input Sort Keyword Search" id="1064" />',
        profiles, profilesOutput, output = '';

        // get user's custom sort order request
        let sortRequest = processTags('<t4 type="content" name="Sort Order" output="normal" modifiers="striptags,htmlentities" />');
        let sortRequestArray = (sortRequest) ? sortRequest.split(',') : null;

        // create a clean array based on the user's input
        let priority = sortRequestArray.map(item => item.trim());

        // create profiles object
        // replace removes the trailing comma to form valid JSON - added an empty value could cause other issues
        profiles = eval('[' + processT4Tags(profilesNav).replace(/,\s*$/, "") + ']');




        /**
         * 
         * 
         *  Sort and paint profiles
         * 
         */
        if (profiles.length > 0) {
          	let profilesOutput = '';
            
            // sort profiles by priotity input
            profiles = profiles.sort((a, b) => {

                const priorityA = priority.indexOf(a.userId);
                const priorityB = priority.indexOf(b.userId);
        
                // If both items are in the priority array, sort by their priority
                if (priorityA !== -1 && priorityB !== -1) {
                  return priorityA - priorityB;
                }

                  // If only one item is in the priority array, put it first
                if (priorityA !== -1) {
                    return -1;
                } else if (priorityB !== -1) {
                    return 1;
                } 

                // If neither item is in the priority array, sort alphabetically by lastName,firstName
                return a.sortName.localeCompare(b.sortName);
            });


            // loop through profiles to create output
            for (let i = 0; i < profiles.length; i++) {
              
                profilesOutput += ' <li class="swiper-slide oho-animate fade-in-up">\n';
                profilesOutput += '     <article class="profiles-section--item">\n';
                if (profiles[i].photo != '') {
                    profilesOutput += '         <figure class="aspect-ratio-frame" style="--aspect-ratio: 320/284 ">\n';
                    profilesOutput += '             <img src="' + profiles[i].photo + '" loading="lazy" alt="' + profiles[i].name + '">\n';
                    profilesOutput += '         </figure>\n';
                }
                profilesOutput += '         <div class="text-margin-reset funderline">\n';
                profilesOutput += '             <a href="' + profiles[i].url + '">' + profiles[i].name + '</a>\n';
                profilesOutput += '             <div class="global-spacing--1x">\n';
                profilesOutput += '                 <p>' + profiles[i].positionTitles + '</p>\n';
                profilesOutput += '             </div>\n';
                profilesOutput += '         </div>\n';
                profilesOutput += '     </article>\n';
                profilesOutput += ' </li>\n';
            }

            // if there is output wrap in UL tags
            if (profilesOutput != '') {
                output += '<section class="profiles-section departments-profiles-swiper global-margin--15x">';
                output += '<t4 type="meta" meta="html_anchor" />';
                output += '<div class="grid-container oho-animate-sequence">\n';
                if (optional.h2Heading || optional.generalDescription || optional.primaryDept) {
                    output += '<div class="grid-x grid-margin-x"><div class="cell large-9"><div class="section-heading--basic text-margin-reset">';
                }
                if (optional.h2Heading) {
                    output += '<h2 class="oho-animate fade-in">' + optional.h2Heading + '</h2>';
                }
                if (optional.generalDescription) {
                    output += '<div class="global-spacing--2x oho-animate fade-in">' + optional.generalDescription + '</div>';
                }
                if (optional.primaryDept) {
                    output += '<div class="section-heading__link global-spacing--2x oho-animate fade-in"><a href="<t4 type="navigation" name="Faculty and Staff Bio Link to Home" id="995" />?staffDepartment=<?php echo urlencode(strtolower("' + optional.primaryDept + '")); ?>">All Faculty &amp; Staff</a></div>\n';
                }
                if (optional.h2Heading || optional.generalDescription || optional.primaryDept) {
                    output += '</div></div></div>';
                }
                output += '         <div class="global-spacing--6x">\n';
                output += '             <div class="swiper-container oho-animate-sequence">\n';
                output += '                 <ul class="swiper-wrapper">\n';
                output += '                     ' + profilesOutput + '\n';
                output += '                 </ul>\n';
                output += '                 <div class="slider-navigation">\n';
                output += '                     <button class="slider-navigation__prev"><i class="far fa-chevron-left" aria-hidden="true"></i><span class="show-for-sr">Go to the previous slide.</span></button>\n';
                output += '                     <button class="slider-navigation__next"><i class="far fa-chevron-right" aria-hidden="true"></i><span class="show-for-sr">Go to the next slide.</span></button>\n';
                output += '                 </div>\n';
                output += '             </div>\n';
                output += '         </div>\n';
                output += '     </div>\n';
                output += ' </section>\n';
            }
        } 

        // Write output
        document.write(processT4Tags(output));
        document.write('');
        if (output == '' && isPreview) {
            document.write('<p style="text-align: center;"><strong>No matching profiles found</strong></p>');
        }
    }
} catch (err) {
    let contentID = typeof content !== 'undefined' ? ' content ID: ' + content.getID() : '';
    let sectionID = typeof section !== 'undefined' ? ' section ID: ' + section.getID() : '';
    let message = 'Programmable Layout Error: ' + err + ' occurred in ' + contentID + sectionID + ')';
    let outputImports = JavaImporter(
        org.apache.commons.lang.StringEscapeUtils,
        java.lang.System
    );
    with (outputImports) {
        if (isPreview) {
            document.write(message);
        } else {
            document.write('<script>console.log("' + StringEscapeUtils.escapeJava(message) + '")</script>');
        }
        System.out.println(message);
    }
}