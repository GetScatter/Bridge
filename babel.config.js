module.exports = {
	'env': {
		'prod':{
			presets: [
				'@vue/app'
			]
		},
		'test': {
			"presets": ["@babel/preset-env"],
			"plugins": [
				["@babel/transform-runtime"]
			]
		}
	},
}
