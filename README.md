# Arkadium technical test
The framework uses the playwright library.
More documentation about playwright: https://playwright.dev/docs/intro

# Local run
Requirements:

Node.js 18+

Allure reporter installed on your operating system for report

Before running the tests, make sure to install the dependencies:

```
npm install
npx playwright install
```
To run the tests use the following command:
```
npm run test
```
or
```
npx playwright test
```
To generate Allure report use command
```
npm run report
```
or
```
allure generate .
allure serve
```
Also you can run tests in ui mode for debugging:
```
npx playwright test --ui
```
![](./img.png)
Note that 1 test fails intentionally, for demonstration purposes.

If you are using Windows, better run the commands in Git Bash.

# Docker run

Requirements:

Docker


To run the tests with Docker use the command:
```
docker run  --rm -v ${pwd}:/app osachi/arkadium npx playwright test
```
The same way you can generate report if you have Nodejs and Allure:
```
npm run report
```
# CI run
Tests can be run on GitHub Actions. Go to the repository. Open the Actions tab, select Run Test Workflow and run it (https://github.com/RomanOsadchi/arkadium_demo/actions/workflows/arcadium.yml), but you need launch permissions, which will be provided you.

The test run will start and you will be able to watch it progress on the allure testops here:
https://yuri.testops.cloud/project/1/launches.
Then you can see the result of the run. Credentials for allure testops will be provided you upon your request.

# Azure devops run
Link to pipeline https://dev.azure.com/romanosadchi/arcadium_demo/_build
Start build and after the run is completed, you can see the results in the "Test" tab,
a more detailed report can be seen in the "Allure report" tab.

Additionally, integration with "Allure testops" has been added,
where you can see the launch results from with ADO: https://yuri.testops.cloud/project/1/launches.
I note that allure testops does not run tests, it only publishes test results from azure runner.
