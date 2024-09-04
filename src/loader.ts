import path from "path";
import fs from "fs";
import type { EndpointDetails, HeaderDetail, RequestBodyDetail, ResponseDetail, YosemiteConfig, YosemiteOptions } from "./types/types"
import express, { Express, Request, NextFunction, Response, Router } from "express";

export function yosemite(options: YosemiteOptions = {}){
    // DEFAULT OPTIONS
    const { filePath = path.join(process.cwd(), 'yosemite.json'), autoGenerate = false} = options;

    const yosemiteRouter = express.Router();

    // Serve static files from the 'public' directory within the package
    yosemiteRouter.use('/yosemite-static', express.static(path.join(__dirname, 'public')));



    yosemiteRouter.get('/yosemite', (req: Request, res: Response) => {
        const yosemiteConfig: YosemiteConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const htmlPath = path.join(__dirname, 'public', 'views', 'index.html');

        let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Inject the API documentation data into the HTML template
        htmlContent = htmlContent
            .replace('{{config.name}}', yosemiteConfig.config.name)
            .replace('{{config.name}}', yosemiteConfig.config.name)
            .replace('{{config.description}}', yosemiteConfig.config.description)
            .replace('{{endpoints}}', generateEndpointsHtml(yosemiteConfig.endpoints));

        res.send(htmlContent);
    });

    return yosemiteRouter;
}
// Function to generate HTML for the endpoints and inject into the template
function generateEndpointsHtml(endpoints: Record<string, EndpointDetails>): string {
    return Object.entries(endpoints)
      .map(([route, details]) => {
        return `
          <div class="endpoint">
            <div class="endpoint-header  ${details.method + route.split('/').join('-')} accordion-toggle">
                <div class="flex items-center">
                    <div class="method ${details.method.toLowerCase()}" >${details.method}</div>
                    <h3 class="route">${route}</h3>
                    <p class="description">${details.description}</p>
                </div>

                <div class="arrow-down" style="height:14px; width: 14px; display: none "> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></div>
            
                <div class="arrow-up" style="height:14px; width: 14px "> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/></svg></div>
            
            
                </div>
            <div class="endpoint-content ${ hashCode(route)}">
              
              ${generateParameterBodySection(details.parameters ?? {})}
              ${generateHeaderBodySection(details.headers ?? { })}
              ${generateRequestBodySection(details.requestBody ?? {})}
              ${generateResponsesSection(details.responses ?? {})}
            </div>
          </div>
        `;
      })
      .join('');
  }
  function generateRequestBodySection(requestBody?: Record<string, RequestBodyDetail>): string {
    if (!requestBody) return '';
    return `
      <div>
        <h4>Request Body</h4>
        <div class=" relative">
        <pre id="code-block" class="custom-code-block">${JSON.stringify(requestBody, null, 2)}</pre>        
        <button class="copy-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg></button>
        </div>

      </div>
    `;
  }
  function generateParameterBodySection(parameters?: Record<string, {}>): string {
    if (!parameters) return '';
    return `
      <div>
        <h4>Parameters</h4>
        <div class=" relative">
        <pre id="code-block" class="custom-code-block">${JSON.stringify(parameters, null, 2)}</pre>        
        <button class="copy-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg></button>
        </div>

      </div>
    `;
  }
  
  function generateResponsesSection(responses: Record<string, ResponseDetail>): string {
    return `
      <div>
        <h4>Responses</h4>
        <div class=" relative">
        <pre id="code-block" class="custom-code-block">${JSON.stringify(responses, null, 2)}</pre>
        <button class="copy-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg></button>
        
        </div>
      </div>
    `;
  }
  function generateHeaderBodySection(headers: Record<string, HeaderDetail>): string {
    return `
      <div>
        <h4>Headers</h4>
        <div class=" relative">
        <pre id="code-block" class="custom-code-block">${JSON.stringify(headers, null, 2)}</pre>
        <button class="copy-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg></button>
        
        </div>
      </div>
    `;
  }

  function hashCode(string : string){
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var code = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return "H"+hash
}