import requests
import re
import time
def extract_urls_from_user(url):
    """
    Fetches the HTML content of a given URL, extracts specific URLs, and returns them as a list.

    Args:
        url (str): The URL to fetch.
        output_filename (str): The file name to save the HTML content.

    Returns:
        list: A list of extracted URLs after "viewOnAmazon":.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    }

    try:
        # Fetch the URL
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Extract URLs after "viewOnAmazon":
        pattern = r'"viewOnAmazon":"(https?://[^"]+)"'
        matches = re.findall(pattern, response.text)

        # Return extracted URLs
        return matches

    except Exception as e:
        print(f"Error while processing URL: {e}")
        return []

def extract_data_from_review(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    }

    try:
        time.sleep(2)
        output_filename = "output.html"
        # Fetch the URL
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        with open(output_filename, "w", encoding="utf-8") as file:
            file.write(response.text)
        print(f"HTML content saved to {output_filename}")    
        return

    except Exception as e:
        print(f"Error while processing URL: {e}")
        return []
    return

if __name__ == "__main__":
    # Provide the URL
    url = "https://www.amazon.co.uk/gp/profile/amzn1.account.AG5NUUTO3S6T5ZTNHDSZRP72O4GQ/ref=cm_cr_dp_d_gw_tr?ie=UTF8"

    # Extract URLs and save HTML content
    urls = extract_urls_from_user(url)
    extract_data_from_review(urls[1])
    # Print extracted URLs
    if urls:
        print("Extracted URLs:")
        for extracted_url in urls:
            print(extracted_url)
    else:
        print("No URLs found matching the pattern.")
