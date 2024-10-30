export const  extractPublicId = (url: string)=> {
  // Remove the domain and 'upload/' prefix, and remove the extension at the end
  const regex = /\/upload\/(?:v\d+\/)?(.+?)(\.\w+)?$/;
  const match = url.match(regex);
  
  if (match) {
    return match[1];  // This is the public_id
  }
  return null;
}