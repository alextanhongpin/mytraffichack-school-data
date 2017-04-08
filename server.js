
const csv = require('csv')
const fs = require('fs')

const NodeGeocoder = require('node-geocoder')
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyD75wlY77m173Rp5j2tfexn5BEnJF2jDVk',
  formatter: null
}

const geocoder = NodeGeocoder(options)

const filteredCountry = ['wp kuala lumpur', 'selangor', 'putrajaya']
const output = {
  data: []
}
fs.readFile('sekolahrendahdanmenengahmac2015.csv', (err, data) => {
  csv.parse(data, (err, res) => {
    // Remove the header
    res.splice(0, 1)
    console.log(res[0])
    const input = res// [res[0], res[1]]
    input.forEach((row, index) => {
    	const bil = row[0]
    	const peringkatSekolah = row[1]
    	const ppd = row[2]
    	const kodSekolah = row[3]
    	const namaSekolah = row[4]
    	const alamatSurat = row[5]
    	const poskodSurat = row[6]
    	const bandarSurat = row[7]
    	const negeri = row[8]
    	const noTelefon = row[9]
    	const noFax = row[10]

    	if (filteredCountry.indexOf(negeri.toLowerCase()) !== -1) {
    		const addressToGeocode = [alamatSurat, poskodSurat, bandarSurat].join(' ')
	    	console.log('geocoding address:', addressToGeocode)
	    	setTimeout(() => {
		    	geocoder.geocode(addressToGeocode)
				.then((data) => {
		  			console.log('address geocoded:', data)
				  	const model = {
			    		bil,
			    		peringkatSekolah,
			    		ppd,
			    		kodSekolah,
			    		namaSekolah,
			    		alamatSurat,
			    		poskodSurat,
			    		bandarSurat,
			    		negeri,
			    		noTelefon,
			    		noFax,
			    		geocodedAddress: data && data[0]
		    	  	}
		    		output.data.push(model)
		    		// if (output.data.length - 1 === index) {
			      		console.log('writing to csv file')
					    fs.writeFile('output.json', JSON.stringify(output), 'utf8', (err, data) => {
					      console.log(err, data)
					    })
			    	// }
		    	}).catch((err) => {
		    		console.log(err)
		    	})
	    	}, index * 50)
    	}
    })
  })
})
