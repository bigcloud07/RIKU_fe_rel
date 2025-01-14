import React from "react";
import NewMainCard from "./NewMainCard";
import NewMainImage from "../../assets/Main-img/NewMainImage.svg"
import NewUrgentImage from "../../assets/Main-img/NewUrgentStatus.svg"
import NewClosedImage from "../../assets/Main-img/NewClosedStatus.svg"
import TabNavigationUI from "../TabNavigationUI";

const NewMain: React.FC = () => {

    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-6">
            <div className="">
              <NewMainCard
              title="반포한강공원"
              date="12/24 목요일"
              status="모집중"
              imageUrl={NewMainImage}
              event_type="정규런"/>
            </div>
            <div className="">
              <NewMainCard
              title="반포한강공원"
              date="12/24 목요일"
              status="모집중"
              imageUrl={NewMainImage}
              event_type="번개런"/>
            </div>
            <div className="">
              <NewMainCard
              title="반포한강공원"
              date="12/24 목요일"
              status="모집중"
              imageUrl={NewMainImage}
              event_type="훈련"/>
            </div>
            <div className="">
              <NewMainCard
              title="반포한강공원"
              date="12/24 목요일"
              status="모집중"
              imageUrl={NewMainImage}
              event_type="행사"/>
            </div>
            <TabNavigationUI/>
          </div>  
        </div>
      );
}

export default NewMain;