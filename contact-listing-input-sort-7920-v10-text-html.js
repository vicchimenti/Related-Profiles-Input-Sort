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


        // variables
        var profilesNav = '<t4 type="navigation" name="Contact Listing Input Sort Keyword Search" id="1076" />',
        profiles, profilesOutput, output = '';

        // get user's custom sort order request
        let sortRequest = processTags('<t4 type="content" name="Sort Order" output="normal" modifiers="striptags,htmlentities" />');
        let sortRequestArray = (sortRequest) ? sortRequest.split(',') : null;

        // create a clean array based on the user's input
        let priority = sortRequestArray.map(item => item.trim());


        // defining main functions
        function sortByName( el1, el2 ) {

            var a = el1.nameSort;
            var b = el2.nameSort;

            return (a < b) ? -1 : (a > b) ? 1 : 0;
        }





        // create profiles object
        // replace removes the trailing comma to form valid JSON - added an empty value could cause other issues
        profiles = eval('[' + processT4Tags(profilesNav).replace(/,\s*$/, "") + ']');
  
        // if there are profiles...
        if (profiles.length > 0) {
          	var profilesOutput = '';
            
            // sort profiles by nameSort
            // profiles = profiles.sort(sortByName);

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
            log("profiles length: " + profiles.length);
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
                if (profiles[i].phone != '' || profiles[i].email != '') {
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

                log("i = " + i);
            }

            // if there is output wrap in UL tags
            if (profilesOutput != '') {
                output += '<section class="contact-listing-section global-margin--10x" id="<t4 type="meta" meta="content_id" />">\n';
                output += '    <t4 type="meta" meta="html_anchor" />\n';
                output += '    <div class="grid-container oho-animate-sequence">\n';
                output += '        <div class="grid-x grid-margin-x">\n';
                output += '            <div class="cell large-9">\n';
                output += '                <div class="section-heading--basic text-margin-reset">\n';
                output += '                    <h2 class="oho-animate fade-in">\n';
                output += '                        <t4 type="content" name="Heading" output="normal" modifiers="striptags,htmlentities" />\n';
                output += '                    </h2>\n';
                output += '                    <div class="global-spacing--2x oho-animate fade-in">\n';
                output += '                        <p>\n';
                output += '                            <t4 type="content" name="General Description" output="normal" modifiers="striptags,htmlentities" />\n';
                output += '                        </p>\n';
                output += '                    </div>\n';
                output += '                    <div class="section-heading__link global-spacing--2x oho-animate fade-in oho-animate--in">\n';
                output += '                        <t4 type="content" name="Optional Link Internal Link" output="selective-output" modifiers="nav_sections" process-format="true" format="<a href=&quot;<t4 type=&quot;content&quot; name=&quot;Optional Link Internal Link&quot; output=&quot;linkurl&quot; modifiers=&quot;nav_sections&quot; />&quot;><t4 type=&quot;content&quot; name=&quot;Optional Link Title&quot; output=&quot;normal&quot; modifiers=&quot;striptags,htmlentities&quot; /></a>" />\n';
                output += '                        <t4 type="content" name="Optional Link External Link" output="selective-output" process-format="true" format="<a href=&quot;<t4 type=&quot;content&quot; name=&quot;Optional Link External Link&quot; output=&quot;normal&quot; modifiers=&quot;striptags,htmlentities&quot; />&quot;><t4 type=&quot;content&quot; name=&quot;Optional Link Title&quot; output=&quot;normal&quot; modifiers=&quot;striptags,htmlentities&quot; /></a>" />\n';
                output += '                    </div>\n';
                output += '                </div>\n';
                output += '            </div>\n';
                output += '        </div>\n';
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