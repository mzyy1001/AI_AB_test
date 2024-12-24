from selenium import webdriver
from selenium.webdriver.chrome.service import Service

# Path to ChromeDriver executable
chromedriver_path = "C:/Program Files/ChromeDriver/chromedriver.exe"

# Set options if necessary
options = webdriver.ChromeOptions()
options.binary_location = "C:/Program Files/Google/Chrome/Application/chrome.exe"  # Path to Chrome browser

# Initialize the Service object
service = Service(chromedriver_path)

# Initialize the WebDriver
driver = webdriver.Chrome(service=service, options=options)

# Test by navigating to a website
driver.get("https://www.google.com")
print(driver.title)  # Print the page title

# Close the browser
driver.quit()
