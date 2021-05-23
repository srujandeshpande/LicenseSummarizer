import React from "react";

function Svg({ licenses }) {
    const textSpace = 50;
    const cardHeight = 90 + textSpace * Object.keys(licenses).length;
    const cardWidth = 495;

    const barheight = 10;
    const barY = 40;
    const barXStart = 50;
    const barWidth = cardWidth - 2 * barXStart;
    const barColors = ["#581845", "#900C3F", "#C70039", "#FF5733", "#FFC300"];

    const textStartX = barXStart;
    const textStartY = barY + 40;

    const licenseList = [];
    var total = 0;

    for (const key in licenses) {
        const licenseDetails = {
            name: key,
            count: parseInt(licenses[key]),
            percentage: 0,
            barStartX: 0,
            width: 0,
            textStartY: 0,
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
    var prevTextStartY = textStartY;
    for (const licenseIndex in licenseList) {
        const perc = licenseList[licenseIndex].count / total;
        const width = parseFloat((barWidth * perc).toFixed(2));

        licenseList[licenseIndex].percentage = parseFloat(perc.toFixed(2));
        licenseList[licenseIndex].barStartX = prevXLoc;
        licenseList[licenseIndex].width = width;
        licenseList[licenseIndex].textStartY = prevTextStartY;

        prevTextStartY += textSpace;
        prevXLoc += width;
    }

    function createMask(licenseItem, key) {
        return (
            <rect
                key={key}
                xmlns="http://www.w3.org/2000/svg"
                mask="url(#rect-mask)"
                x={licenseItem.barStartX}
                y={barY}
                width={licenseItem.width}
                height={barheight}
                fill={barColors[key]}
            />
        );
    }

    function createLabel(licenseItem, key) {
        return (
            <g
                transform={
                    "translate(" +
                    textStartX +
                    ", " +
                    licenseItem.textStartY +
                    ")"
                }
                key={key}
            >
                <circle cx="5" cy="6" r="5" fill={barColors[key]} />
                <text x="15" y="10" fill="#fff">
                    {licenseItem.name + " - " + licenseItem.count}
                </text>
            </g>
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
                    {licenseList.map(createLabel)}
                </g>
            </svg>
        </>
    );
}

export default Svg;
