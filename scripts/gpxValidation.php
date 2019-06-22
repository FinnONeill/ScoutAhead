<?php
$xml = XMLReader::open('test.xml');

// The validate parser option must be enabled for 
// this method to work properly
$xml->setParserProperty(XMLReader::VALIDATE, true);

var_dump($xml->isValid());
?>