const mobileNumberFormatter = mobile => {
	mobile = mobile.toString()
	if (/(^\d{9,11}$)/.test(mobile)) {
		if (/(^((947|07|7)(0|1|2|4|5|6|7|8)[0-9]{7})$)/.test(mobile)) {
			return '94' + mobile.substr(mobile.length - 9)
		} else {
			return false
		}
	} else {
		return false
	}
}

export { mobileNumberFormatter }
