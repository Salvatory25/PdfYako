// Use the environment variable if deployed, otherwise fallback to local backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const uploadAndProcess = async (
  endpoint: string, 
  files: File[], 
  onProgress?: (progress: number) => void,
  extraData?: Record<string, string>
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            let fullUrl = '';
            if (response.downloadUrl) {
              const baseUrl = API_BASE_URL.replace('/api', '');
              fullUrl = response.downloadUrl.startsWith('http') 
                ? response.downloadUrl 
                : `${baseUrl}${response.downloadUrl}`;
            }
            resolve({ url: fullUrl, text: response.text, summary: response.summary });
          } else {
            reject(new Error(response.message || 'Processing failed'));
          }
        } catch (e) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.message || `Server error: ${xhr.status}`));
        } catch {
          reject(new Error(`Server error: ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error occurred during upload.'));
    });

    xhr.open('POST', `${API_BASE_URL}${endpoint}`, true);
    xhr.send(formData);
  });
};
