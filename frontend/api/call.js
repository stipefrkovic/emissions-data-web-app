/**
 * Makes an API call to the given URL
 * @param url
 * @param method
 * @param data
 * @returns a promise
 */
export default async function apiCall(url, method = "GET",  data = null, content = "application/json")  {
    // We obtain the server preference from the state storage (implemented using
    // local storage APIs in this case)
    const server = "http://localhost:3000";
  
    // Construct URL
    url = `${server}/${url}`;
  
    // Set options
    /** @type {RequestInit} */
    const requestConfig = {
        method: method,
        headers: {
            "Content-Type": content,
        },
    };
    console.log(content);
  
    // Set data: in this case we want to send the request data as
    // URL parameters for GET/HEAD/DELETE requests and only as request body
    // for other requests. This is possible since our specification is compatible
    // with this assumption. Other APIs might actually need both body and URL
    // parameters.
    if (data != null) {
      if (method === "GET" || method === "HEAD" || method === "DELETE") {
        // Use as parameter data
        url += "?" + new URLSearchParams(data).toString();
      } else {
        // Use as body data
        requestConfig.body = JSON.stringify(data);
      }
    }
  
    // Await the result: any errors will the thrown
    return await fetch(url, requestConfig);
  }
  