(function() {
    function init() {
      var beestAccTour = setupShepherd();
    
      function dismissTour() {
        if (!localStorage.getItem('beestAccTour')) {
            localStorage.setItem('beestAccTour', 'completed');
        }
      }
      
      // Dismiss the tour when the cancel icon is clicked. Do not show the tour on next page reload
      beestAccTour.on('cancel', dismissTour);
      
      // Initiate the tour
      if (!localStorage.getItem('beestAccTour')) {
      beestAccTour.start();
      }
    }
    /*const beestAccTour = new Shepherd.Tour({
      defaultStepOptions: {
        classes: 'tour-guide',
        scrollTo: true,
        useModalOverlay: true,
        when: {
          show() {
            const currentStepElement = shepherd.currentStep.el;
            const header = currentStepElement.querySelector('.shepherd-header');
            const progress = document.createElement('span');
            progress.style['margin-right'] = '15px';
            progress.innerText = `${shepherd.steps.indexOf(shepherd.currentStep) + 1}/${shepherd.steps.length}`;
            header.insertBefore(progress, currentStepElement.querySelector('.shepherd-cancel-icon'));        
          }
        } 
      }
    });*/
    
    function setupShepherd() {
      var beestAccTour = new Shepherd.Tour({
        defaultStepOptions: {
          cancelIcon: {
            enabled: true
          },
          classes: 'tour-guide',
          scrollTo: true,
          useModalOverlay: true,
          when: {
            show() {
              const currentStepElement = beestAccTour.currentStep.el;
              const footer = currentStepElement.querySelector('.shepherd-footer');
              const progressPercentage = ((beestAccTour.steps.indexOf(beestAccTour.currentStep) + 1)/beestAccTour.steps.length)*100 + '%';
              const progress = document.createElement('div');
              const innerBar = document.createElement('span');
              innerBar.style.width=progressPercentage;
              progress.className='shepherd-progress-bar';
              innerBar.className='progress-bar progress-bar-striped'
              //progress.style['margin-right'] = '15px';
              if (document.getElementsByClassName('shepherd-button').length==1) {
                progress.style.minWidth = '260px';
            }  
              progress.appendChild(innerBar);
              $(footer).after(progress, currentStepElement.querySelector('.shepherd-button'));   
            }
          } 
        },
        
        // This should add the first tour step
        steps: [
          {
            title: 'Help',
            text: 'Hover over the green question marks <span class="text-success small">&nbsp;<i class="h5 fa fa-question-circle"></i></span> to reveal instructions on how to use that option or text box.',
            attachTo: {
              element: '.fa-question-circle',
              on: 'bottom'
            },
            buttons: [
              {
                action: function() {
                  return this.cancel();
                },
                secondary: true,
                text: 'End tour'
              },
              {
                action: function() {
                  return this.next();
                },
                text: UTNxt
              }
            ],
            id: 'help'
          },
          {
            title: 'Style your Accordion',
            text: 'Write and style your main heading (sits above the accordion) and choose the style of your drawers as well. Lastly, choose whether your accordion will have the first drawer open or closed.',
            attachTo: {
              element: '.beestAccStyle',
              on: 'right'
            },
            buttons: [
              {
                action: function() {
                  return this.back();
                },
                secondary: true,
                text: UTBk
              },
              {
                action: function() {
                  return this.next();
                },
                text: UTNxt
              }
            ],
            id: 'styleAcc'
          }
        ],
        useModalOverlay: true
      });
      
      // These steps should be added via `addSteps`
      const steps = [
        {
          title: 'Accordion Content',
          text: 'Insert the text for your drawer headings, and the content that will sit in that drawer.',
          attachTo: {
            element: '.beestAccContent',
            on: 'right'
          },
          buttons: [
            {
              action: function() {
                return this.back();
              },
              secondary: true,
              text: UTBk
            },
            {
              action: function() {
                return this.next();
              },
              text: UTNxt
            }
          ],
          id: 'accordionContent'
        },
        {
          title: 'Number of Drawers +<br>Preview & Copy',
          text: 'Choose the number of drawers for your accordion. Either use the +/- buttons or click in and type a number from 2 - 10. Then preview your code (use the expansion button to see your accordion full screen) and then copy the code for your accordion. You will prompted to save what you have built to return to it later. There is also a button here that will reveal a video guide for pasting HTML code into Moodle.',
          attachTo: {
            element: '.beestAccRightSide',
            on: 'left'
          },
          buttons: [
            {
              action: function() {
                return this.back();
              },
              secondary: true,
              text: UTBk
            },
            {
              action: function() {
                return this.next();
              },
              text: UTNxt
            }
          ],
          id: 'previewPlusDrawers'
        },
        {
          title: 'Restore a previous item',
          text: 'Once you have created and saved a BEEST element, you can recover it and edit it, or paste the HTML from Moodle and the BEEST will update to reflect all of the previous information you had compiled to create the element.',
          attachTo: {
            element: '.beestRecover',
            on: 'bottom'
          },
          buttons: [
            {
              action: function() {
                return this.back();
              },
              secondary: true,
              text: UTBk
            },
            {
              action: function() {
                return this.next();
              },
              text: UTNxt
            },
          ],
          id: 'recover'
        },
        {
          title: 'Clear the page',
          text: 'Clear the page will reset all options to their defaults without saving.',
          attachTo: {
            element: '.beestTopButtons',
            on: 'bottom'
          },
          buttons: [
            {
              action: function() {
                return this.back();
              },
              secondary: true,
              text: UTBk
            },
            {
              action: function() {
                return this.next();
              },
              text: UTFin
            },
          ],
          id: 'top buttons'
        }
      ];
  
      beestAccTour.addSteps(steps);
  
       //This should add steps after the ones added with `addSteps`
   
      return beestAccTour;
    }
  
    function ready() {
      if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
        init();
      } else {
        document.addEventListener('DOMContentLoaded', init);
      }
    }
  
    ready();
  }).call(void 0);
  
  