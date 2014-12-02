[![NPM version](https://badge.fury.io/js/slot-cli.svg)](http://badge.fury.io/js/slot-cli)
[![GitHub version](https://badge.fury.io/gh/SlotTeam%2Fslot-cli.svg)](http://badge.fury.io/gh/SlotTeam%2Fslot-cli)

# [Slot Command Line Interface](http://www.SlotFramework.org/docs)

> The official Slot Command-Line Interface, a friendly tool for easy handle Slot Framework projects (manage projects, fragments, REST services and Html5 Themes), 
 see more at [Slot CLI Docs](http://www.SlotFramework.org/docs).


slot -h 
=======
    $ slot -h
      Usage: slot-cli [options] [command]

      Commands:

        *

        create [project]
           Create a new project on folder [name]

        start [options]
           Start servers on current slot project, without parameters, it starts the designer server by default

        add [options]
           Add a new object to current slot project


        Options:
          
          -h, --help     output usage information
          -V, --version  output the version number



slot create -h
==============
    $ slot create -h
      Usage: create [options] [project]
    
      Options:
    
        -t, --theme [theme]          Which theme_id to use
        -h, --help  output usage information



slot add -h
===========
    $ slot add -h
      Usage: add [options]
    
      Options:
    
        -h, --help                 output usage information
        -p, --page [page]          Which page name to use
        -f, --fragment [fragment]  Which fragment name to use
        -r, --rest [rest]          Which rest service name to use



slot start -h
=============
    $ slot start -h
      Usage: start [options]
    
      Options:
    
        -h, --help     output usage information
        -s, --design   Start the designer server on current slot project
        -d, --develop  Start the development server on current slot project
        -a, --all      Start designer and development server on current slot project
