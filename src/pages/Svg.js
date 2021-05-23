import React from "react";

function Svg({ licenses }) {
    const cardHeight = 195;
    const cardWidth = 495;

    const barheight = 10;
    const barY = 30;
    const barXStart = 50;
    const barWidth = cardWidth - 2 * barXStart;
    const barColors = ["#581845", "#900C3F", "#C70039", "#FF5733", "#FFC300"];

    const licenseList = [];
    var total = 0;

    for (const key in licenses) {
        const licenseDetails = {
            name: key,
            count: parseInt(licenses[key]),
            percentage: 0,
            startX: 0,
            width: 0,
        };
        total += licenseDetails.count;
        licenseList.push(licenseDetails);
    }

    function compare(a, b) {
        if (a.count > b.count) {
            return -1;
        } else {
            return 1;
        }
    }

    licenseList.sort(compare);
    var prevXLoc = barXStart;
    for (const licenseIndex in licenseList) {
        const perc = licenseList[licenseIndex].count / total;
        const width = parseFloat((barWidth * perc).toFixed(2));

        licenseList[licenseIndex].percentage = parseFloat(perc.toFixed(2));
        licenseList[licenseIndex].startX = prevXLoc;
        licenseList[licenseIndex].width = width;

        prevXLoc += width;
    }

    function createMask(liscenceItem, key) {
        return (
            <rect
                key={key}
                xmlns="http://www.w3.org/2000/svg"
                mask="url(#rect-mask)"
                x={liscenceItem.startX}
                y={barY}
                width={liscenceItem.width}
                height={barheight}
                fill={barColors[key]}
            />
        );
    }

    return (
        <>
            <svg
                width={cardWidth}
                height={cardHeight}
                style={{ background: "#0d1017" }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <g>
                    <mask xmlns="http://www.w3.org/2000/svg" id="rect-mask">
                        <rect
                            x={barXStart}
                            y={barY}
                            width={barWidth}
                            height={barheight}
                            fill="white"
                            rx="5"
                        />
                    </mask>
                    {licenseList.map(createMask)}
                </g>
            </svg>
        </>
    );
}

export default Svg;
