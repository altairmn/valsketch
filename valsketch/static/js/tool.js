/* jshint esversion: 6 */

class Tool {
    constructor(id) {
        $( "span.part-add" ).on("click", function(eventObject) {
            Tool.activePath = new paper.Path(); 
            var element = $( this );
            Tool.activePart = {
                parent : element.parent("div.part-container").eq(0),
                part_name : element.siblings(".part-name").eq(0),
                status : element.siblings(".part-status").eq(0),
                color : element.siblings(".part-color").eq(0),
            };
        });

        $( "span.part-remove" ).on("click", function(eventObject) {
            
        });

        $( "#delete-button").on("click", function(eventObject) {
            Tool.activePath.remove();
        });

        $( "#complete-button").on("click", function(eventObject) {
            Tool.activePath.close();
            var part_container = Tool.activePart;
            var part_status = part_container.children(".part-status")[0];
            part_status = Number(part_status) + 1;
        });

        $( "#undo-button").on("click", function(eventObject) {
            Tool.activePath.lastSegment.remove();
        });

        /* setup the part paths object */
        Tool.partPaths = {};
        $('.part-name').each(function(index, element) {

        });
    } 

}

/* |draw|       (d1)
 * |delete|     (d2)
 * |undo tool|   (d3)
 * |complete|   (d4)
 *|s1| |part-name| (p1) |+| (b1) |-| (b2)
 * ...
 * ...
 * ...
 *
 *
 *                                  |submit| (Sf)
 *
 * ## Environment ##
 * activePath
 * partArray
 * */

/*
 * b1.click -> d1.activate(), pcur = p1, activePath = new()
 * d2.click -> d1.deactivate(), pcur.deactivate(), activePath.remove()
 * d3.click -> activePath--; if (activePath.length == 1) d1.deactivate(), pcur.deactivate(), activePath.remove()
 * d4.click -> pcur.s++, pcur.deactivate(), d1.deactivate(), partArray[pcur.idx].push(activePath), activePath.deactivate()
 * activePath.close? -> d4.click
 * b2.click -> partArray[b2.part].pop(), b2.s--
 */
