<?php
  
  header("Content-type: text/javascript");
  
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
    
    $js = ''; 
    
    foreach ($paths as $path) {
      if ($path['extension'] == 'js') {
        $js .= file_get_contents("../src/".$path['basename']);
      }
    }
    
    file_put_contents("../jquery.svg.input.js", $js);
    
    echo $js; 
  }
    
?>