import { useEffect, useRef, useState } from 'react';

export default function RenderWithBoundingBoxes() {
  const [html, setHtml] = useState('');
  const containerRef = useRef(null);
  const [domain, setDomain] = useState(null);

  useEffect(() => {
    const updateDomainFromPath = () => {
      const path = window.location.pathname; // e.g., /learn-more
      const newUrl = `https://techolution.com${path}`;
      console.log("new url is", newUrl);
      setDomain(newUrl);
    };

    // Initial load
    updateDomainFromPath();

    // Listen to back/forward navigation
    window.addEventListener('popstate', updateDomainFromPath);

    // Optional: If you are using pushState in your app, patch it
    // const originalPushState = history.pushState;
    // history.pushState = function (...args) {
    //   originalPushState.apply(this, args);
    //   updateDomainFromPath();
    // };

    return () => {
      window.removeEventListener('popstate', updateDomainFromPath);
    };
  }, []);

  useEffect(() => {
    // Fetch HTML from Puppeteer or other endpoint
    if(!domain)return ;
    fetch(`http://localhost:3002/scrape-and-highlight?url=${domain}`)
      .then(res => res.text())
      .then(setHtml);
  }, [domain]);

  useEffect(() => {
    const highlightDivs = () => {
      const container = containerRef.current;
      if (!container) return;

      const divs = container.querySelectorAll('div');
      divs.forEach(div => {
        const rect = div.getBoundingClientRect();
        const overlay = document.createElement('div');

        // Style bounding box overlay
        Object.assign(overlay.style, {
          position: 'absolute',
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          border: '1px dashed red',
          zIndex: 1,
          pointerEvents: 'none',
        });

        const button = document.createElement('button');
        button.textContent = '+';
        Object.assign(button.style, {
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer',
          zIndex: 10000,
          pointerEvents: 'auto',
        });

        // Add custom functionality to the button
        button.addEventListener('click', () => {
          // Show the original button text in the alert
          alert(`Button text is: "${div.textContent}"`);
        });

        overlay.appendChild(button);

        document.body.appendChild(overlay);
      });
    };

    const timeout = setTimeout(highlightDivs, 1000); // delay for layout

    return () => clearTimeout(timeout);
  }, [html]);

  return (
      <div
        ref={containerRef}
        
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
  );
  
}
