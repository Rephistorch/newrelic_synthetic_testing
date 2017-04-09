/** CONFIGURATIONS **/


function retryOnFail(scriptSteps)
{
  var retryCount = 3;
  var success = false;
  for (var i = 1; i <= retryCount && !success; i++)
  {
    try {
      console.log("This is run number: " + i + " of 3");
      return scriptSteps(), success = true;     
    } catch(err){
      console.log("Script failed, trying again.");
      continue;
    }
  }
}



retryOnFail(function() {
// Theshold for duration of entire script - fails test if script lasts longer than X (in ms)
// Script-wide timeout for all wait and waitAndFind functions (in ms)
// ## Fix this so the step timeout is different from teh 
  var StepTimeout = 15000;
  var ScriptTimeout = 90000;
  // Change to any User Agent you want to use.
  // Leave as "default" or empty to use the Synthetics default.
  var UserAgent = "default";
  var continueFlag = true;
  /** HELPER VARIABLES AND FUNCTIONS **/
  
  // ########### try/catch wrapper for function steps ##################
  function stepCheck(contFlag, stepNo, stepName, stepFunc)
  {
    if (!contFlag){
      console.log("Continue Flag is false.  Skipping step " + stepNo + ": " + stepName);
      return;
    }
    else{
      log(stepNo, stepName);
      try {
        var stepResult = stepFunc();
        return stepResult;
      } catch(err){
        log(stepNo, ': ' + stepName + ' failed: ' + err.message);
        continueFlag = false;
        throw(err);
      }
    }
  }

  var assert = require('assert'),
    By = $driver.By,
    browser = $browser.manage(),
    startTime = Date.now(),
    stepStartTime = Date.now(),
    prevMsg = '',
    prevStep = 0,
    lastStep = 9999,
  VARS = {};

  var log = function(thisStep, thisMsg) {
    if (thisStep > 1 || thisStep == lastStep) {
      var totalTimeElapsed = Date.now() - startTime;
      var prevStepTimeElapsed = totalTimeElapsed - stepStartTime;
      console.log('Step ' + prevStep + ': ' + prevMsg + ' FINISHED. It took ' + prevStepTimeElapsed + 'ms to complete.');
      $util.insights.set('Step ' + prevStep + ': ' + prevMsg, prevStepTimeElapsed);
      if (ScriptTimeout > 0 && totalTimeElapsed > ScriptTimeout) {
        throw new Error('Script timed out. ' + totalTimeElapsed + 'ms is longer than script timeout threshold of ' + ScriptTimeout + 'ms.');
      }
    }
    if (thisStep > 0 && thisStep != lastStep) {
      stepStartTime = Date.now() - startTime;
      console.log('Step ' + thisStep + ': ' + thisMsg + ' STARTED at ' + stepStartTime + 'ms.');
      prevMsg = thisMsg;
      prevStep = thisStep;
    }
  };

  function isAlertPresent() {
    try {
      var thisAlert = $browser.switchTo().alert();
      return true;
    } catch (err) { return false; }
  }

  // Returns Boolean of whether something ("el") is selected.
  function isElementSelected(el) { return $browser.findElement(el).isSelected(); }


  function isTextPresentIn(text, selector) {
    return $browser.findElement(selector)
      .getText()
      .then(function (wholetext) {
        try{
        return wholetext.indexOf(text) != -1;
        } catch(err) {
        return false;
        }
      })
  }
  

  function isTextPresent(text) {
    return isTextPresentIn(text, By.tagName('html'));
  }

  /** BEGINNING OF SCRIPT **/

  console.log('Starting synthetics script: nopCommerce_NR');
  console.log('Default timeout is set to ' + (ScriptTimeout/1000) + ' seconds');
  console.log('Variables set in this script: ', VARS);

  // Setting User Agent is not then-able, so we do this first (if defined and not default)
  if (UserAgent && (0 !== UserAgent.trim().length) && (UserAgent != 'default')) {
    $browser.addHeader('User-Agent', UserAgent);
    console.log('Setting User-Agent to ' + UserAgent);
  }
  
  // Variables
  var element;

  // Get browser capabilities and do nothing with it, so that we start with a then-able command
  // ### I'm not quite sure why this is necessary.  I'm going to see what starting on the browser.get does.
  //$browser.getCapabilities().then(function () { })

  // Step 1
  // First step has to be a function with a return value so we can start the .then chain.
  function startScript(){ 
    log(1, '$browser.get("http://nop.cs.rackspace.com/")');
    try {
      return $browser.get("http://nop.cs.rackspace.com/");
    } catch(err) {
      log(1, "Couldn't load http://nop.cs.rackspace.com/: " + err.message);
      continueFlag = false;
      return;
    }
  }
  startScript()
  
  // Step2
  .then(stepCheck(continueFlag, 2.1, 'Find clickElement "Electronics"', function(){element = $browser.waitForAndFindElement(By.linkText("Electronics"), StepTimeout);}))
  .then(stepCheck(continueFlag, 2.2, 'Click Element "Electronics"', function(){ element.click(); }))

  // Step 3
  .then(stepCheck(continueFlag, 3.1, 'Find clickElement "//div[@class=\'side-2\']//a[normalize-space(.)=\'Camera & photo\']"', $browser.waitForAndFindElement(By.xpath("//div[@class=\'side-2\']//a[normalize-space(.)=\'Camera & photo\']"), StepTimeout)))
  .then(stepCheck(continueFlag, 3.2, 'Click on clickElement "//div[@class=\'side-2\']//a[normalize-space(.)=\'Camera & photo\']"', function(element) { element.click(); }))
  
  // Step 4
  .then(stepCheck(continueFlag, 4.1, 'Find "input.button-2.product-box-add-to-cart-button"', $browser.waitForAndFindElement(By.css("input.button-2.product-box-add-to-cart-button"), StepTimeout)))
  .then(stepCheck(continueFlag, 4.2, 'clickElement "input.button-2.product-box-add-to-cart-button"', function(element){ element.click(); }))

  // Step 5
  .then(stepCheck(continueFlag, 5.1, 'Find "add-to-cart-button-14"', $browser.waitForAndFindElement(By.id("add-to-cart-button-14"), StepTimeout)))
  .then(stepCheck(continueFlag, 5.2, 'Click Element "add-to-cart-button-14"', function(element){ element.click(); }))

  // Step 6
  .then(stepCheck(continueFlag, 6.1, 'Find clickElement "//div[@class=\'footer-upper\']//a[.=\'Shopping cart\']"', $browser.waitForAndFindElement(By.xpath("//div[@class=\'footer-upper\']//a[.=\'Shopping cart\']"), StepTimeout)))
  .then(stepCheck(continueFlag, 6.2, 'Click Element "//div[@class=\'footer-upper\']//a[.=\'Shopping cart\']"', function(element){ element.click(); }))

  // Das Ende
  .then(function() {
    log(lastStep, '');
    console.log('Browser script execution SUCCEEDED.');
  }, function(err) {
    console.log ('Browser script execution FAILED.');
    throw(err);
  })
});
/** END OF SCRIPT **/
