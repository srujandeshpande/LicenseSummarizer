import React, { useEffect, useRef } from 'react'

function Canvas(props) {
    var licenses = props.licenses;
    const canvasRef = useRef(null);
    const width = 1200;
    const height = 650;
    // var licenses = { 'MIT License': 5, 'MIT3 License': 15, 'MIT2 License': 2, 'Apache License 2.0': 7, Other: 17 }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);



        context.font = 'bold 30pt Menlo'
        context.textAlign = 'left'
        context.textBaseline = 'top'

        var w = 180;

        var total = 0;
        var count = 0;
        var l = [];

        for (const key in licenses) {
            l.push([licenses[key], key]);
        }

        function compare(a, b) {
            if (parseInt(a[0]) > parseInt(b[0])) {
                return -1;
            }
            else {
                return 1;
            }
        }
        l.sort(compare);
        count = l.length;
        for (var i = 0; i < l.length; i++) {
            total += l[i][0];
        }

        var colors = ['#581845', '#900C3F', '#C70039', '#FF5733', '#FFC300']
        var cstart = 60;
        for (var i = 0; i < l.length; i++) {
            context.fillStyle = '#fff'
            context.fillText(`${l[i][1]} - ${l[i][0]}`, 150, w);
            context.fillStyle = colors[i]
            context.fillRect(60, w - 10, 60, 60);
            // Total length = 1080
            // Start at 60
            var len = (1080 * l[i][0]) / total;
            // gap from left, top gap, total length, width of line
            context.fillRect(cstart, 60, len, 60);
            cstart += len;
            w += 90
        }

    });
    return (
        <canvas ref={canvasRef} width={width} height={height} />
    )
}
export default Canvas
