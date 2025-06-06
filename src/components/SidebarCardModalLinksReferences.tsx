import {
    FaFacebook,
    FaInstagram,
    FaMapMarkedAlt,
    FaTripadvisor,
    FaGlobe,
  } from "react-icons/fa";
  import { SidebarInfo } from "./SidebarInfo";
  import type { Place } from "../models/Place";
  
  export function SidebarCardModalLinksReferences({
    selectedPlace,
  }: {
    selectedPlace: Place;
  }) {
    const domainIcons: Record<string, React.ReactNode> = {
      "maps.google.com": <FaMapMarkedAlt className="w-5 h-5 text-green-600" />,
      "www.google.com": <FaMapMarkedAlt className="w-5 h-5 text-green-600" />,
      "facebook.com": <FaFacebook className="w-5 h-5 text-blue-600" />,
      "instagram.com": <FaInstagram className="w-5 h-5 text-pink-500" />,
      "tripadvisor.it": <FaTripadvisor className="w-5 h-5 text-emerald-600" />,
    };
  
    function getDomainIcon(url: string): React.ReactNode {
      try {
        const { hostname } = new URL(url);
        const baseDomain = hostname.replace(/^www\./, "");
        return (
          domainIcons[hostname] ||
          domainIcons[baseDomain] || (
            <FaGlobe className="w-5 h-5 text-gray-500" />
          )
        );
      } catch {
        return <FaGlobe className="w-5 h-5 text-gray-500" />;
      }
    }
  
    function getTooltipLabel(url: string): string {
      try {
        const { hostname } = new URL(url);
        return hostname.replace(/^www\./, "");
      } catch {
        return url;
      }
    }
  
    if (
      !selectedPlace.urlReferences ||
      selectedPlace.urlReferences.length === 0
    ) {
      return null;
    }
  
    return (
      <SidebarInfo label="Link utili">
        <div className="flex gap-3 flex-wrap">
          {selectedPlace.urlReferences.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={getTooltipLabel(url)}
              className="hover:opacity-80 transition"
            >
              {getDomainIcon(url)}
            </a>
          ))}
        </div>
      </SidebarInfo>
    );
  }
  