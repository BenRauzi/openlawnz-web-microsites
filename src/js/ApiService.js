class ApiService {
	/**
	 * define base url and field schemas here
	 * @returns {ApiService}
	 */
	constructor() {
		this.apiUrl = process.env.GATSBY_API_URL + "/graphql";
		this.caseFields = `{
		case {
			caseName
			id
			caseCitations {
				citation
			}
			casesCitedsByCaseCited {
				caseByCaseOrigin {
				caseName
				id
				}
				caseByCaseCited {
				caseName
				id
				}
			}
			legislationToCases {
				section
				legislationId
				legislation {
				title
				link
				}
			}
			pdf {
				pdfDbKey
			}
		}
	}`;
	}

	/**
	 * Generic function to fetch data from server
	 * @param {string} query
	 * @returns {unresolved}
	 */
	async getGraphQlData(resource, params, fields) {
		const query = `
			query singleCase {
				${resource} ${this.paramsToString(params)}
				${fields}
			}`;
		const res = await fetch(`${this.apiUrl}`, {
			method: "POST",
			body: JSON.stringify({
				query: query
			}),
			headers: {
				"Content-Type": "application/json"
			}
		});
		
		const body = await res.json();
		
		return body.data;
	}

	/**
	 *
	 * @param {object} params
	 * @returns {array} cases list or empty list
	 */
	async getCases(params = {}) {
		const data = await this.getGraphQlData("caseCitations", params, this.caseFields);
		return data.cases;
	}

	async getCase(params = {}) {
		const data = await this.getGraphQlData("caseCitation", params, this.caseFields);
		return data.caseCitation.case ? data.caseCitation : null;
	}

	/**
*
* @param {object} params
* @returns {String} params
converted to string for usage in graphQL
*/
	paramsToString(params) {
		let paramString = "";
		if (params.constructor === Object && Object.keys(params).length) {
			let tmp = [];
			for (const key in params) {
				let paramStr = params[key];
				if (paramStr !== "") {
					if (typeof params[key] === "string") {
						paramStr = `"${paramStr}"`;
					}
					tmp.push(`${key}:${paramStr}`);
				}
			}
			if (tmp.length) {
				paramString = `(${tmp.join()})`;
			}
		}
		return paramString;
	}
}
export default new ApiService();
