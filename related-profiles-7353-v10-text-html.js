/* 
    Related Profiles
    v10/text/html

    Programmable Layout that reads in related profiles as JSON then sorts based on the nameSort node

    This was converted to a PL to allow srting by a custom node which cannot be done through a keyword search navigation
*/
try {
    var FullListOutputImports = JavaImporter(
        com.terminalfour.publish.utils.TreeTraversalUtils,
        com.terminalfour.spring.ApplicationContextProvider,
        com.terminalfour.content.IContentManager,
        com.terminalfour.version.Version,
        com.terminalfour.publish.utils.BrokerUtils,
        com.terminalfour.sitemanager.cache.CachedContent
    );
    with (FullListOutputImports) {
        // variables
        var profilesNav = '<t4 type="navigation" name="Faculty and Staff Related Profiles" id="996" />',
        profiles, profilesOutput, output = '';

        // defining main functions
        function sortByName( el1, el2 ) {
            var a = el1.nameSort;
            var b = el2.nameSort;
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        }

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
            var contentManager = getContentManager();
            if (typeof contentVersion !== 'undefined') {
                return contentManager.get(contentID, language, Version(contentVersion))
            } else {
                var version;
                if (isPreview) {
                    version = contentManager.get(contentID, language).version;
                } else {
                    version = contentManager.getLastApprovedVersion(contentID, language);
                }
                return contentManager.get(contentID, language, version);
            }
        }

        function processT4Tags(t4tag, contentID, sectionID, forMediaFile) {
            var cachedContent = content || null;
            var cachedSection = section;
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
            var renderedHtml = String(BrokerUtils.processT4Tags(dbStatement, publishCache, cachedSection, cachedContent, language, isPreview, t4tag));
            if (forMediaFile) {
                renderedHtml = renderedHtml.replace(/&/gi, '&amp;');
            }
            return renderedHtml;
        }

        function processTags(t4Tag) {
            myContent = content || null;
            return String(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag));
        }




        /***
         * 
         *      Optional Elements
         * 
         */
        let optional = {

            primaryDept: processTags('<t4 type="content" name="Primary Department" output="normal" display_field="value" />'),
            h2Heading: processTags('<t4 type="content" name="Heading" output="normal" modifiers="striptags,htmlentities" />'),
            generalDescription: processTags('<t4 type="content" name="General Description" output="normal" modifiers="nl2br" />')

        };

        /***
         * 
         *      create profiles object
         *      replace removes the trailing comma to form valid JSON - added an empty value could cause other issues
         * 
         */
        profiles = eval('[' + processT4Tags(profilesNav).replace(/,\s*$/, "") + ']');
  

        /***
         * 
         *      loop through profiles if there are any
         * 
         */
        if (profiles.length > 0) {
          	var profilesOutput = '';
            
            // sort profiles by nameSort
            profiles = profiles.sort(sortByName);

            // loop through profiles to create output
            for (let i=0; i<profiles.length; i++) {
              
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

            // if there is output wrap in section
            if (profilesOutput != '') {
                output += ' <section class="profiles-section departments-profiles-swiper global-margin--10x" id="<t4 type="meta" meta="content_id" />">\n';
                output += '    <t4 type="meta" meta="html_anchor" />\n';
                output += '     <div class="grid-container oho-animate-sequence">\n';
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
                    output += '<div class="section-heading__link global-spacing--2x oho-animate fade-in"><a href="<t4 type="navigation" name="Faculty and Staff Bio Link to Home" id="995" />?staffDepartment=<?php echo urlencode(strtolower("' + optional.primaryDept + '")); ?>">All Faculty &amp; Staff</a></div>';
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
    var contentID = typeof content !== 'undefined' ? ' content ID: ' + content.getID() : '';
    var sectionID = typeof section !== 'undefined' ? ' section ID: ' + section.getID() : '';
    var message = 'Programmable Layout Error: ' + err + ' occurred in ' + contentID + sectionID + ')';
    var outputImports = JavaImporter(
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