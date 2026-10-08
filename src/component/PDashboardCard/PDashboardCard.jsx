import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import arrow from "../../utils/assets/images/arrow.svg";
const PDashboardCard = ({ title, value, icon, subtitle, route, onClick, showNavIcon = false, iconBoxSize = 45, iconSize = 22, titleSize = 28,
  valueSize = 72, bgColor = "#ffffff", indicatorColor = "#FF3B30", position = "start" }) => {

  const navigate = useNavigate();
  const handleOnClick = () => {
    if (onClick) {
      onClick();
    }

    if (route) {
      navigate(route);
    }
  };

  return (
    <>
      <style>{`
          .dashboard-card {
            border-radius: 6px;
            padding: 20px;
            transition: 0.3s ease;
            position: relative;
            height:100%;
            display:flex;
            justify-content: end;
            cursor:pointer;
          }
          .dashboard-card.flexcard{
            align-items: self-start;
            width:100%;
            justify-content:start;
          }
          .dashboard-card.blockcard{
            flex-direction: column;
          }
          .dashboard-card.flexcard .card-top{ 
            min-width: 150px;
          }

          .card-top {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .icon-box {
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .card-title {
            color: #000000;
            line-height: 30px;
            margin: 0;
          }
          .card-value-wrapper{
            display: inline-flex;
            flex-direction: column;
            width: auto;
          }
          .card-value {
            font-weight: 400;
            color: #000000;
            line-height:72px;
            margin: 0;
            width:auto;
            display: inline-block;
          }

          .card-subtext {
            font-size: 18px;
            color: #000000;
          }

          .nav-icon {
            position: absolute;
            right: 15px;
            top: 15px;
            color: #94a3b8;
          }
          .card-view{
            position:relative;
            overflow:hidden;
            cursor:pointer;
            display:flex;
            column-gap: 8px;
          }
          .card-view .text{ font-weight:bold; font-size:16px;transition:transform .3s ease;}
          .card-view .icon{ position: relative; transition: transform 0.3s ease;}
          .card-view:hover .icon { 
            display: inline-flex;
            transform: translateX(10px);
          }
          .card-block{ width:36px; height:11px;display:flex;}
          .dashboard-card.blockcard .card-block{margin-left:3px;}
          .dashboard-card.blockcard .card-bottom{ margin-top:20px;}
          .dashboard-card.flexcard .card-block{margin-right:3px;}
          .dashboard-card.flexcard .card-value-wrapper{width:120px;}
        `}</style>

      <div
        className={`dashboard-card ${position === 'start' ? 'blockcard' : 'flexcard'}`}
        onClick={handleOnClick}
        style={{ cursor: route ? "pointer" : "default", background: bgColor }}
      >
        {showNavIcon && route && (
          <div className="nav-icon">
            <FaArrowRight />
          </div>
        )}

        <div className="card-top">
          <div className="card-value-wrapper" style={{ alignItems: position }}>
            <h3 className="card-value" style={{ fontSize: valueSize }}>
              {value}
            </h3>
            <span className="card-block" style={{ background: indicatorColor }}></span>
          </div>
        </div>
        <div className="card-bottom">
          <p className="card-title" style={{ fontSize: titleSize }}>
            {title}
          </p>
          {subtitle && <p className="card-subtext">{subtitle}</p>}
          <p className="card-view"
          ><span className="text">View</span> <span className="icon"><img src={arrow} alt="Arrow" style={{ width: 25 }} /></span></p>
        </div>
      </div>
    </>
  );
};

export default PDashboardCard;