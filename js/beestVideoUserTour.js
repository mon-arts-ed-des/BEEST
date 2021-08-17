(function() {
  function init() {
    var beestVidTour = setupShepherd();
  
    function dismissTour() {
      if (!localStorage.getItem('beestVidTour')) {
          localStorage.setItem('beestVidTour', 'completed');
      }
    }
    
    // Dismiss the tour when the cancel icon is clicked. Do not show the tour on next page reload
    beestVidTour.on('cancel', dismissTour);
    
    // Initiate the tour
    if (!localStorage.getItem('beestVidTour')) {
    beestVidTour.start();
    }
  }
  /*const beestVidTour = new Shepherd.Tour({
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
    var beestVidTour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'tour-guide',
        scrollTo: true,
        useModalOverlay: true,
        when: {
          show() {
            const currentStepElement = beestVidTour.currentStep.el;
            const footer = currentStepElement.querySelector('.shepherd-footer');
            const progressPercentage = ((beestVidTour.steps.indexOf(beestVidTour.currentStep) + 1)/beestVidTour.steps.length)*100 + '%';
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
          title: 'Video link',
          text: 'Paste your video link in this space. BEEST currently supports Panopto, Vimeo, TEDTalks and YouTube. click the link for your desired platform to reveal a walkthrough to show you which link you need for the BEEST to work correctly. The BEEST will alter this link to be the URL required for embedding the video.',
          attachTo: {
            element: '.beestVidPasteLink',
            on: 'top'
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
          id: 'pastelink'
        }
      ],
      useModalOverlay: true
    });
    
    // These steps should be added via `addSteps`
    const steps = [
      {
        title: 'Context',
        text: 'It is best practice to give your video some context for the viewer before they click play. Type the context for your video in this space.',
        attachTo: {
          element: '.beestVidContext',
          on: 'top'
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
        id: 'context'
      },
      {
        title: 'Position the video',
        text: 'Your video can be on the left or right of screen. It defaults to right so that on smaller screens the text sits above the video, but you can change this option to have the video sit to the left and the text will collapse underneath the video.',
        attachTo: {
          element: '.beestVidPosition',
          on: 'top'
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
        id: 'position'
      },
      {
        title: 'Width of the video',
        text: 'The responsive video code splits the screen width into 12 columns. So you can make the video 50% width (6 columns) or 33.3% (4 columns) as we have found in testing these sizes produce the best results.',
        attachTo: {
          element: '.beestVidWidth',
          on: 'top'
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
        id: 'width'
      },
      {
        title: 'Heading for the video',
        text: 'Give your video a heading, choose its size, and if you want an icon in the heading. Make sure to consider whether this is a main heading or subheading and use consistent icons for content types (video, media, reading).',
        attachTo: {
          element: '.headingOptions',
          on: 'top'
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
        id: 'heading'
      },
      {
        title: 'Preview your element',
        text: 'See how your final product will look in real time. After each change, click anywhere on the screen and the preview will update to reflect your changes. Click the expand button <i class="fa fa-expand border border-dark rounded p-2"></i> to see at your element in fullscreen.',
        attachTo: {
          element: '.beestPreview',
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
        id: 'preview'
      },
      {
        title: 'Copy your code',
        text: 'Clicking this button will copy the code to your clipboard and prompt you to name your element to store it and return to later if you want to edit it or notice an error. There is also a button below that will reveal a video walkthrough on how to paste this code into Moodle.',
        attachTo: {
          element: '.beestCopyCode',
          on: 'top'
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
        id: 'copy your code'
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
            text: UTNxt
          },
        ],
        id: 'top buttons'
      },
      {
        title: 'Feedback',
        text: 'Click this link to provide feedback and improvements on the BEEST elements directly to the BEEST team.',
        attachTo: {
          element: '.beestFeedback',
          on: 'top'
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
        id: 'feedback'
      },
      {
        title: 'End of tour',
        text: 'Enjoy creating your new BEEST elements! Contact the BEEST teeam at <a href="mailto:beest@monash.edu" target="_blank">beest@monash.edu</a> (opens in a new window) for any further queries you have or support you require.',
        buttons: [
          {
            action: function() {
              return this.cancel();
            },
            text: UTFin
          },
        ],
        id: 'finish tour'
      },
    ];

    beestVidTour.addSteps(steps);

     //This should add steps after the ones added with `addSteps`
 
    return beestVidTour;
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

