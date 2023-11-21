const axios = require("axios");
const { fetchBootstapReleaseInfo } = require("../src/createCSVFromAPICall");


const githubUrl = process.env.Bootstrap_GitHub_API_URL


describe("fetchBootstrapReleaseInfo()", () => {
    const releaseData = [
        {
        created_at: '2020-11-11T17:07:37Z',
        tag_name: 'v5.0.0-alpha3',     
        zipball_url: 'https://api.github.com/repos/twbs/bootstrap/zipball/v5.0.0-alpha3'
        },
        {
        created_at: '2020-06-16T19:12:01Z',  
        tag_name: 'v5.0.0-alpha1',
        zipball_url: 'https://api.github.com/repos/twbs/bootstrap/zipball/v5.0.0-alpha1'
        }
    ];

    beforeEach(() => {
        jest.spyOn(axios, 'get');
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should make GET request to appropriate URL", async () => {
        await fetchBootstapReleaseInfo();
        const expectedURL = githubUrl
        expect(axios.get).toHaveBeenCalledWith(expectedURL);
    });

    it("should resolve with an object containing release data", async () => {
        axios.get.mockImplementation(() => Promise.resolve({ data: releaseData }));

        const response = await fetchBootstapReleaseInfo();

        expect(response).toEqual(releaseData)
    });

    it("should log an error to the console", async () => {
        axios.get.mockImplementation(() =>
            Promise.reject(new Error("GET request failed."))
        );
        jest.spyOn(console, "error");

        await fetchBootstapReleaseInfo();

        expect(console.error).toHaveBeenCalledWith("Error fetching data: GET request failed.");
    });
});