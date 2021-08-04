(function() {
  function init() {
    var beestVidTour = setupShepherd();
  
    function dismissTour() {
      if (!localStorage.getItem('beestVidTour')) {
          localStorage.setItem('beestVidTour', 'yes');
      }
    }
    
    // Dismiss the tour when the cancel icon is clicked. Do not show the tour on next page reload
    beestVidTour.on('cancel', dismissTour);
    
    // Initiate the tour
    if (!localStorage.getItem('beestVidTour')) {
    beestVidTour.start();
    }
  }
  
  function setupShepherd() {
    var beestVidTour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'class-1 class-2',
        scrollTo: {
          behavior: 'smooth',
          block: 'center'
        }
        
      },
      
      // This should add the first tour step
      steps: [
        
        {
          title: 'Video link',
          text: 'Paste your video link in this space. BEEST currently supports Panopto, Vimeo, TEDTalks and YouTube. watch the videos linked for each platform to find which link you need for the BEEST to work correctly and the BEEST will alter this link to be the URL required for embedding the video.',
          attachTo: {
            element: '.beestVidPasteLink',
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
          }
        ],
        id: 'context'
      },
      {
        title: 'Position the video',
        text: 'Your video can be on the left or right of screen. It defaults to right so that on smaller screens the text sits above the video, but you can change this option to have the video sit to the left and the text will collapse underneath the video.',
        attachTo: {
          element: '.beestVidPosition',
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
          }
        ],
        id: 'position'
      },
      {
        title: 'Width of the video',
        text: 'Your video can be either 50% (6 columns - one half) or 33% (4 columns - one third) of the screen width. This is because we divide the screen into 12 columns and best practice dictates the video should take no more the 50% of the screen space, but should also not be so small that the viewer does not recognise it as a video.',
        attachTo: {
          element: '.beestVidWidth',
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
          }
        ],
        id: 'width'
      },
      {
        title: 'Heading for the video',
        text: 'Give your video a heading, choose its size, and if you want an icon in the heading. It can be small (h5), medium (h4) or large (h3). Make sure to consider whether this is a main heading or subheading and not make it larger than a heading that has come before it. And use consistent icons for content types (video, media, reading).',
        attachTo: {
          element: '.headingOptions',
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
        id: 'heading'
      },
      {
        title: 'Preview your element',
        text: 'See how your final product will look in real time. After each change if you click anywhere on the screen, the preview will update to reflect your changes. You can then click the expand button - <i class="fa fa-expand border border-dark rounded p-2"></i> - to look at your element in fullscreen to get an accurate preview of what it will look like on your Moodle site.',
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
        text: 'Click the button to copy the code for your BEEST element. This will prompt you to name your element to store and return to later if you want to edit it slightly, or notice an error.',
        attachTo: {
          element: '.beestCopyCode',
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
        id: 'copy your code'
      },
      {
        title: 'Restore a previous item',
        text: 'Once you have created and saved a BEEST element, you can recover it to edit it again, or paste the HTML from Moodle and the BEEST will update to reflect all of the previous information you had compiled to create the element.',
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
        title: 'Important buttons',
        text: 'Clear the page will reset all options to blank without saving, and Turn off help with remove all green question marks from the page if you are a confident user and no longer require the help and have managed to tame the BEEST.',
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
        title: 'End of tour',
        text: 'Enjoy creating your new BEEST elements! Please provide feedback on any bugs, issues or improvements by clicking the <a href="https://docs.google.com/forms/d/e/1FAIpQLSeojgdmy3o6gUq1ZzuV3Q2YflUDfxH4TKKzz5lbpTJLmLOm5w/viewform?usp=sf_link" target="_blank">Feedback/Improvements/Issues</a> (opens in a new window) link at the bottom of each BEEST page, and feel free to contact <a href="mailto:beest@monash.edu" target="_blank">beest@monash.edu</a> (opens in a new window) for any further queries you have or support you require.',
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

