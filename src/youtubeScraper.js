const axios = require('axios');

module.exports = {
	getSong: async (q) => {
		const { data } = await axios.get(`http://youtube-scrap-service.herokuapp.com/api/v1/getVideo/${q}`);
		return data;
	}
};