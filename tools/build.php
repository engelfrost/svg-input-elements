<?php
  
  function compare_filenames($a, $b) {
    return strcmp($a['basename'], $b['basename']);
  }

  if ($handle = opendir('.')) {
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
        print '<script type="text/javascript" src="' . $path['basename'] . '"></script>';
      }
    }
  }
    
?>