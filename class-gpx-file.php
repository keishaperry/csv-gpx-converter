<?php
class GPXFile {
  public $name;
  public $lat;
  public $lon;
  public $desc;
  private $input;

  function __construct($input) {
    $this->input = json_decode($input);
    $this->fileheaders = true;


    if ($this->fileheaders) {
        array_shift($this->input);
    }
    $xml_header = '<?xml version="1.0" encoding="UTF-8"?><gpx></gpx>';
    $xml = new SimpleXMLElement($xml_header);

    $xml->addAttribute('xmlns', 'http://www.topografix.com/GPX/1/1');
    $node1 = $xml->addChild('metadata');
    $s1 = $node1->addChild('name','testData');
    //$subnode1->addAttribute('text', 'testData');
    foreach ($this->input as $row){
        if (!empty($row)){
            $row_data = explode(",",$row);
            $s2 = $xml->addchild('wpt');
            $s2->addAttribute('lat', $row_data[2]);
            $s2->addAttribute('lon', "-".$row_data[3]);
            $s3 = $s2->addchild('name',$row_data[0]);
            $s4 = $s2->addchild('cmt',$row_data[1]);
            $s5 = $s2->addchild('desc',$row_data[1]);
            //$s6 = $s2->addchild('link');
            //$s6->addAttribute('href',$row_data[4]);
            $s7 = $s2->addchild('type','POI pin');      
        }
    }

    echo $xml->asXML();
  }

}
?>