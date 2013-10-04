//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            if (explanation.length !== 0) {
                var canvas = new NumberedTrianglesCanvas($content.find(".explanation")[0]);
                canvas.createCanvas(explanation);
            }


            this_e.setAnimationHeight($content.height() + 60);

        });

       

        var colorOrange4 = "#F0801A";
        var colorOrange3 = "#FA8F00";
        var colorOrange2 = "#FAA600";
        var colorOrange1 = "#FABA00";

        var colorBlue4 = "#294270";
        var colorBlue3 = "#006CA9";
        var colorBlue2 = "#65A1CF";
        var colorBlue1 = "#8FC7ED";

        var colorGrey4 = "#737370";
        var colorGrey3 = "#9D9E9E";
        var colorGrey2 = "#C5C6C6";
        var colorGrey1 = "#EBEDED";

        var colorWhite = "#FFFFFF";


        function NumberedTrianglesCanvas(dom) {
            var size = 150;
            var edgeWidth = 5;
            var fontSize = size * 0.15;

            var fullSizeX = size * 2;
            var fullSizeY = size * 2 * Math.sin(Math.PI / 3);

            var paper = Raphael(dom, fullSizeX, fullSizeY, 0, 0);

            var attrTri = {"stroke": colorBlue4, "stroke-width": edgeWidth, "fill": colorBlue1, "stroke-linejoin": "round"};
            var attrNumb = {"stroke": colorBlue4, "fill": colorBlue4, "font-size": fontSize, "font-family": "verdana", "font-weight": "bold"};
            var attrNumbEdge = {"stroke": colorOrange4, "fill": colorOrange4, "font-size": fontSize, "font-family": "verdana", "font-weight": "bold"};

            this.createCanvas = function(chips) {
                for (var i = 0; i < 6; i++) {
                    var chip = paper.set();
                    paper.path(Raphael.format(
                        "M{0},{1}L{2},{3}H{4}Z",
                        fullSizeX / 2,
                        fullSizeY / 2,
                        size / 2,
                        fullSizeY,
                        size * 1.5
                    )).attr(attrTri).rotate(-60 * i, fullSizeX / 2, fullSizeY / 2);
                    var innerR = Math.tan(Math.PI / 6) * size / 2;
                    var numbUpper = fontSize / 2 + edgeWidth;
                    paper.text(fullSizeX / 2, fullSizeY - (numbUpper), chips[i][0]).attr(attrNumbEdge).rotate(-60 * i, fullSizeX / 2, fullSizeY / 2);
                    var numb1 = paper.text(
                        fullSizeX / 2 - (innerR - numbUpper) * Math.cos(Math.PI / 6),
                        fullSizeY - (numbUpper + (innerR - numbUpper) * (Math.cos(Math.PI / 3) + 1)),
                        chips[i][1]).attr(attrNumb);
                    numb1.rotate(-60 * i, fullSizeX / 2, fullSizeY / 2);
                    numb1.rotate(120);
                    var numb2 = paper.text(
                        fullSizeX / 2 + (innerR - numbUpper) * Math.cos(Math.PI / 6),
                        fullSizeY - (numbUpper + (innerR - numbUpper) * (Math.cos(Math.PI / 3) + 1)),
                        chips[i][2]).attr(attrNumb);
                    numb2.rotate(-60 * i, fullSizeX / 2, fullSizeY / 2);
                    numb2.rotate(-120);
                }
            }
        }


    }
);
