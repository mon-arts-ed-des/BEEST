'use strict';

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
          text: 'Paste your video link in this space. BEEST currently supports Panopto, Vimeo, TEDTalks and YouTube. watch the videos linked for each platform to find which link you need for the BEEST to work correctly.',
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
              text: 'Exit'
            },
            {
              action: function() {
                return this.next();
              },
              text: 'Next'
            }
          ],
          id: 'pastelink'
        }
      ],
      useModalOverlay: true
    });

    const element = document.createElement('p');
    element.innerText = 'The BEEST automatically updates the link you paste to be the version required to embed it correctly.';

    // These steps should be added via `addSteps`
    const steps = [
      {
        title: 'Including',
        text: element,
        attachTo: {
          element: '.beestVidPasteLink',
          on: 'bottom'
        },
        buttons: [
          {
            action: function() {
              return this.back();
            },
            secondary: true,
            text: 'Back'
          },
          {
            action: function() {
              return this.next();
            },
            text: 'Next'
          }
        ],
        id: 'howbeestvidworks'
      },
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
            text: 'Back'
          },
          {
            action: function() {
              return this.next();
            },
            text: 'Next'
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
            text: 'Back'
          },
          {
            action: function() {
              return this.next();
            },
            text: 'Next'
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
            text: 'Back'
          },
          {
            action: function() {
              return this.next();
            },
            text: 'Next'
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
            text: 'Back'
          },
          {
            action: function() {
              return this.cancel();
            },
            text: 'Finish tour'
          },
        ],
        id: 'heading'
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

