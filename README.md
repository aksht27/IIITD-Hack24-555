# IIITD-Hack24-555<br>
<h1>Problem statement :: Sustainable Water Management for Drought-Prone Areas</h1><br>
<h2>Flow Chart</h2><br>
LINK:
<h3>Components Needed For IOT Device For Water Leakage:</h3><br>
1.Arduino board (e.g., Arduino Uno)<br>
2.2 x Water pressure sensors (e.g., BMP180)<br>
3.2 x Flow sensors (e.g., YF-S201 or similar)<br>
4.ESP8266/ESP32 (for WiFi connectivity if needed)<br>
5.Resistors, wires, breadboard, etc.<br>
<br>
<h3>Explanation:</h3
*Water Pressure Sensors: The code assumes that you have two BMP180 sensors, one for measuring the input water pressure and one for the output water pressure. The pressure readings are converted from Pascals to hPa (hectopascals).<br>
*Flow Sensor: The flow sensor calculates the flow rate in liters per minute and the total water passed in liters.<br>
*WiFi Module: The ESP8266 is used to connect to a WiFi network and serve a web page with the sensor data.<br>
*Web Server: The Arduino acts as a web server, delivering an HTML page that displays the input and output water pressures, flow rate, and total water passed.<br>
<br>
<h2>Important Notes:</h2><br>
*Replace "yourSSID" and "yourPASSWORD" with your actual WiFi credentials.<br>
*Ensure that the BMP180 sensors are properly connected to the I2C pins of the Arduino.<br>
*The flow sensor must be calibrated to your specific hardware setup to ensure accurate measurements.<br>
<br>


