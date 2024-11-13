/* 
    Contact listing
    v10/text/html

    Programmable Layout that reads in profiles as JSON then sorts based on the nameSort node

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

        /***
         *      Console Log
         */
        log = message => document.write('<script>eval("console.log(\'' + message + '\')");</script>');


        // variables
        let profilesNav = '<t4 type="navigation" name="Contact Listing Test" id="1088" />',
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
         *      optional elements
         *      
         */
        let optional = {

            h2Heading: processTags('<t4 type="content" name="Heading" output="normal" modifiers="striptags,htmlentities" />'),
            generalDescription: processTags('<t4 type="content" name="General Description" output="normal" modifiers="striptags,htmlentities" />'),
            linkTitle: processTags('<t4 type="content" name="Optional Link Title" output="normal" modifiers="striptags,htmlentities" />'),
            internalLinkURL: processTags('<t4 type="content" name="Optional Link Internal Link" output="linkurl" modifiers="nav_sections" />'),
            internalLinkText: processTags('<t4 type="content" name="Optional Link Internal Link" output="linktext" modifiers="nav_sections" />'),
            externalLink: processTags('<t4 type="content" name="Optional Link External Link" output="normal" modifiers="striptags,htmlentities" />')    

        };

        // let h2Heading = processTags('<t4 type="content" name="Heading" output="normal" modifiers="striptags,htmlentities" />');
        // let generalDescription = processTags('<t4 type="content" name="General Description" output="normal" modifiers="striptags,htmlentities" />');
        // let linkTitle = processTags('<t4 type="content" name="Optional Link Title" output="normal" modifiers="striptags,htmlentities" />');
        // let internalLinkURL = processTags('<t4 type="content" name="Optional Link Internal Link" output="linkurl" modifiers="nav_sections" />');
        // let internalLinkText = processTags('<t4 type="content" name="Optional Link Internal Link" output="linktext" modifiers="nav_sections" />');
        // let externalLink = processTags('<t4 type="content" name="Optional Link External Link" output="normal" modifiers="striptags,htmlentities" />');

        
        // create profiles object
        // replace removes the trailing comma to form valid JSON - added an empty value could cause other issues
        profiles = eval('[' + processT4Tags(profilesNav).replace(/,\s*$/, "") + ']');
  
        // if there are profiles...
        if (profiles.length > 0) {
          	var profilesOutput = '';
            
            // sort profiles by nameSort
            profiles = profiles.sort(sortByName);

            // loop through profiles to create output
            for (let i=0; i<profiles.length; i++) {
              
                profilesOutput += '<article class="contact--item global-padding--5x">\n';
                profilesOutput += '    <div class="grid-container">\n';
                profilesOutput += '        <div class="grid-x grid-margin-x' + (profiles.length <= 10 ? ' oho-animate-sequence' : '') + '">\n';
                profilesOutput += '            <div class="cell medium-8 large-9">\n';
                profilesOutput += '                <div class="contact--item__text text-margin-reset' + (profiles.length <= 10 ? ' oho-animate fade-in-left' : '') + '">\n';
                profilesOutput += '                    <h3 class="funderline">\n';
                profilesOutput += '                        <a href="' + profiles[i].url + '">' + profiles[i].name + '</a>\n';
                profilesOutput += '                   </h3>\n';
                profilesOutput += '                    <div class="global-spacing--2x">\n';
                profilesOutput += '                        <p>' + profiles[i].positionTitles + '</p>\n';
                profilesOutput += '                    </div>\n';
                if (profiles[i].phone != '' || profiles[i].email != '' || profiles[i].buildingRoomNumber != '') {
                    profilesOutput += '                   <div class="global-spacing--3x">\n';
                    profilesOutput += '                        <ul class="icon-list">\n';
                    if (profiles[i].phone != '') {
                        profilesOutput += '                            <li>\n';
                        profilesOutput += '                                <span class="icon-list__icon fas fa-phone" aria-hidden="true"></span>\n';
                        profilesOutput += '                                <span class="icon-list__content"><a href="tel:' + profiles[i].phone.replace(/\s/g, "") + '">' + profiles[i].phone + '</a>\n';
                        profilesOutput += '                                </span>\n';
                        profilesOutput += '                            </li>\n';
                    }
                    if (profiles[i].email != '') {
                        profilesOutput += '                            <li>\n';
                        profilesOutput += '                                <span class="icon-list__icon fas fa-envelope" aria-hidden="true"></span>\n';
                        profilesOutput += '                                <span class="icon-list__content"><a href="mailto:' + profiles[i].email + '">' + profiles[i].email + '</a></span>\n';
                        profilesOutput += '                            </li>\n';
                    }
                    profilesOutput += '                        </ul>\n';
                    profilesOutput += '                    </div>\n';
                }
                profilesOutput += '                </div>\n';
                profilesOutput += '            </div>\n';
                if (profiles[i].photo != '') {
                    profilesOutput += '            <div class="cell medium-auto">\n';
                    profilesOutput += '                <figure class="aspect-ratio-frame' + (profiles.length <= 10 ? ' oho-animate fade-in' : '') + '" style="--aspect-ratio: 30/26">\n';
                    profilesOutput += '                    <img src="' + profiles[i].photo + '" loading="lazy" alt="' + profiles[i].name + '">\n';
                    profilesOutput += '                </figure>\n';
                    profilesOutput += '            </div>\n';
                }
                profilesOutput += '        </div>\n';
                profilesOutput += '    </div>\n';
                profilesOutput += '</article>\n';
            }

            // if there is output wrap in UL tags
            if (profilesOutput != '') {
                output += '<section class="contact-listing-section global-margin--10x" id="<t4 type="meta" meta="content_id" />">\n';
                output += '    <t4 type="meta" meta="html_anchor" />\n';
                output += '    <div class="grid-container oho-animate-sequence">\n';
                if (optional.h2Heading || optional.generalDescription || optional.linkTitle) {
                    output += '<div class="grid-x grid-margin-x"><div class="cell large-9"><div class="section-heading--basic text-margin-reset">\n';
                }
                if (optional.h2Heading) {
                    output += '<h2 class="oho-animate fade-in">' + optional.h2Heading + '</h2>\n';
                }
                if (optional.generalDescription) {
                    output += '<div class="global-spacing--2x oho-animate fade-in"><p>' + optional.generalDescription + '</p></div>\n';
                }
                if ((optional.linkTitle) && (optional.internalLinkURL && optional.internalLinkText)) {
                    output += '<div class="section-heading__link global-spacing--2x oho-animate fade-in oho-animate--in"><a href="'+ optional.internalLinkURL + '" title="' + optional.internalLinkText + '">' + optional.linkTitle + '</a></div>\n';
                } else if (optional.linkTitle && optional.externalLink) {
                        output += '<div class="section-heading__link global-spacing--2x oho-animate fade-in oho-animate--in"><a href="'+ optional.externalLink+ '" title="' + optional.linkTitle + '">' + optional.linkTitle + '</a></div>\n';
                }
                if (optional.h2Heading || optional.generalDescription || optional.linkTitle) {
                    output += '</div></div></div>\n';
                }
                output += '        <div id="data-container"' + (profiles.length > 10 ? ' class="add-pagination"' : '') + '>\n';
                output += '             ' + profilesOutput + '\n';
                output += '        </div>\n';
                output += '        <div id="pagination-container"></div>\n';
                output += '</div>\n</section>\n';
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