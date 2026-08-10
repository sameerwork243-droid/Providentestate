"use client";

import { useState } from "react";

export function OfficeCard({ office }: { office: any }) {
  const [open, setOpen] = useState(false);
  const href = `/contact/${office.slug}/`;
  const maps = office.latitude != null && office.longitude != null
    ? `https://www.google.com/maps/search/?api=1&query=${office.latitude},${office.longitude}`
    : null;

  return (
    <>
      <div className="office-item">
        <a className="img-section img-zoom" href={href}>
          {office.tile_image?.url && (
            <img loading="lazy" draggable="false" src={office.tile_image.url} alt={office.title + " - Provident Estate"} />
          )}
        </a>
        <div className="about-office">
          <a className="name" href={href}>
            {office.title}
          </a>
          <p className="address">{office.address}</p>
          {maps && (
            <a href={maps} className="maps-link" target="_blank" rel="noreferrer">
              <span>View on Google Maps</span>
            </a>
          )}
        </div>
        <div className="divider"></div>
        <div className="phone-section">
          <p className="sub-title">Phone</p>
          {office.phone && (
            <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="phone">
              {office.phone}
            </a>
          )}
        </div>
        <div className="divider"></div>
        <div className="email-section">
          <div className="office-contact-modal-wrap">
            <button className="button button-orange trigger-button" type="button" onClick={() => setOpen(true)}>
              Contact Office
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="modal fade show d-block" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-fullscreen-md">
            <div className="modal-content">
              <div className="modal-header">
                <button className="modal-close" type="button" aria-label="Close" onClick={() => setOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 5L15 15M15 5L5 15" stroke="#07234B" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="office-contact-modal-header">
                  <div className="content-section">
                    <p className="title">{office.title}</p>
                    <p className="address">{office.address}</p>
                    <div className="description">
                      {maps && (
                        <a href={maps} target="_blank" rel="noreferrer" className="maps-link">
                          <span>View on Google Maps</span>
                        </a>
                      )}
                      {office.phone && (
                        <p className="phone">
                          <a href={`tel:${office.phone.replace(/\s/g, "")}`}>{office.phone}</a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <a className="button button-orange" href={href}>
                  <span>Contact Office</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
