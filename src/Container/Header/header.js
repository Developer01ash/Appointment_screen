import React from "react";
import './header.css'
import companyImage from "../../assests/images/company-logo.png";
import externalLink from "../../assests/images/external-link.png"
import downArrow from "../../assests/images/chevron-down.png";


function Header() {
  return (
    <>
      <div className="mainHeaderdiv">
        <div className="companyname">
          <img src={companyImage} />
        </div>

        <div className="HeaderDiv2">
          <span className="Menu-btn">Menu <img src={downArrow} /></span>
          <span className="contact-btn">Contact us</span>
          <button className="sharelink-button"><img className="button-image" src={externalLink} />Share Link</button>
        </div>
      </div>
    </>
  );
}

export default Header;