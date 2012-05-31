<?php
 
  header("Content-type: text/javascript");
  header( "Expires: " . gmdate( 'D, d M Y H:i:s' ) . ' GMT' ); 
	header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' ); 
	header( 'Cache-Control: no-cache, must-revalidate' ); 
	header( 'Pragma: no-cache' ); 
	  
	require("./jsmin.php");  
	
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
    
    usort($paths, 'compare_filenames');
    
    $license = '/* SVG Input Elements for SVG jQuery (1.4.4).
   https://github.com/silence150/SVG-Input-Elements
   
   Written by 
     Tim Brandin (info{at}sypreme.se), 
     Josef Ottosson (josef.ottosson{at}josf.se) in 2012

   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it.

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
   copies of the Software, and to permit persons to whom the Software is 
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in 
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
   THE SOFTWARE. */
   
'; 
   $js = '(function($) { // Hide scope, no $ conflict

';
    
    foreach ($paths as $path) {
      if ($path['extension'] == 'js') {
        $js .= file_get_contents("../src/".$path['basename']);
      }
    }
    
    $js .= "\n\n})(jQuery);";
    
    file_put_contents("../jquery.svg.input.js", $license . $js);
    file_put_contents("../jquery.svg.input.min.js", $license . JSMin::minify($js));
    
    echo $license . $js; 
  }
  
?>