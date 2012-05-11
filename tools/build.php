<?php
  
  header("Content-type: text/javascript");
  
  print "/* http://josf.se/svg-input-elements
   SVG Input Elements for (SVG jQuery 1.4.4).
   Written by Tim Brandin (info{at}sypreme.se) & Josef Ottosson (josef.ottosson{at}josf.se) April - June 2012. 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */\n\n";
  
  print "(function($) { // Hide scope, no $ conflict\n\n";
  
  function compare_filenames($a, $b) {
    return strcmp($a['basename'], $b['basename']);
  }

  if ($handle = opendir('../src')) {
    $paths = array();
    while (false !== ($entry = readdir($handle))) {
      if ($entry != "." && $entry != "..") {
        $path = pathinfo($entry);
        $paths[] = $path; 
      }
    }
    closedir($handle);
    
    usort($paths, compare_filenames);
    
    foreach ($paths as $path) {
      if ($path['extension'] == 'js') {
        echo file_get_contents("../src/".$path['basename']);
      }
    }
  }
   
  print "\n})(jQuery);";
  
?>