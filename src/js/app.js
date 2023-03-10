fetch('https://native.tportal.hr/planet-b/wp-json/v3/')
.then(res => res.json())
.then(data => console.log(data))