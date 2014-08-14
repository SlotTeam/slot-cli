slot-cli
========

Command line, a friendly tool for easy handle Slot Framework projects (manage projects, fragments and REST services).


slot -h
=======
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
  Usage: create [options] [project]

  Options:

    -h, --help  output usage information



slot add -h
===========
  Usage: add [options]

  Options:

    -h, --help                 output usage information
    -p, --page [page]          Which page name to use
    -f, --fragment [fragment]  Which fragment name to use
    -r, --rest [rest]          Which rest service name to use



slot start -h
=============
  Usage: start [options]

  Options:

    -h, --help     output usage information
    -s, --design   Start the designer server on current slot project
    -d, --develop  Start the development server on current slot project
    -a, --all      Start designer and development server on current slot project