import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LicenseGen from '../components/LicenseGen';
import Canvas from './Canvas';

async function parser(data) {
	var licenses = {};
	var licname = "";
	for (var i = 0; i < data.length; i++) {
		if (data[i].license != null) {
			licname = data[i].license.name;
			if ((licname in licenses) == false) {
				licenses[licname] = 1;
			}
			else {
				licenses[licname]++;
			}
		}
	}
	return licenses
}

function LicensePage() {
	const { username } = useParams();

	const [l, setL] = useState({});
	useEffect(() => {

		(async () => {
			var res = await fetch(`https://api.github.com/users/${username}/repos`)
			var ll = await res.json();
			console.log(ll)
			// .then(response => response.json())
			// .then(data => parser(data))
			setL(await parser(ll))
		})();
	}, [])
	return (
		<Canvas licenses={l} />
	)
};

export default LicensePage;
