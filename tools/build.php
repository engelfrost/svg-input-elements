<?php
  
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
//         echo $path['basename']; 
        echo file_get_contents("../src/".$path['basename']);
      }
    }
  }
    
?>