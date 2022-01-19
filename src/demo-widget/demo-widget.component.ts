import { Component, Input, OnInit } from '@angular/core';
import { InventoryService } from '@c8y/ngx-components/api';
import {EventService, OperationService} from '@c8y/ngx-components/api';
import { AlertService } from '@c8y/ngx-components';
import * as L from 'leaflet';
import {IManagedObject} from "@c8y/client/lib/src/inventory/IManagedObject";

@Component({
    templateUrl: './demo-widget.component.html',
    styles: [ `../styles/index.css` ]
})
export class WidgetDemo implements OnInit{


    @Input() config;

    public mymap: L.map = null;
    public popupstring =  "<div class=\"card\" style=\"width: 200px; background-color: white;\"><img src=\"https://img.icons8.com/ios/50/000000/substation.png\" class=\"card-img-top\"style=\"width: 200px; height:100px\"><div class=\"card-body\"><br><h4 class=\"card-title\"></h4><hr style = \"margin-top: 2px; margin-bottom: 2px;\"><dl><dt>LM</dt><dd >8400</dd><hr style = \"margin-top: 2px; margin-bottom: 2px;\"><dt >Installation date</dt><dd class=>15 Jan 2020</dd><hr style = \"margin-top: 2px; margin-bottom: 2px;\"><dt>Running hours</dt><dd>482</dd><hr style = \"margin-top: 2px; margin-bottom: 2px;\"><dt translate=\"\">Status</dt><dd><span class = \"text-success\"> Active </span></dd><hr style = \"margin-top: 2px; margin-bottom: 2px;\"><a href = \"#\" class=\"card-link\">Request Maintenance</a></dl></div></div>";
    public  device_markers = {}
    public devices: IManagedObject[] = []

    public blueIcon: L.icon = L.icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHNSURBVFhH3VZbSgMxFHUp7sFk/HUPM+Jvd6JJdSOiUorgJvwQqQiuwC/ftdbaKmqt506v0g7XeSZT8MCBMpOcc3N6k8nSv0Fk9CX/XAwiq4/BSdhcWeNH9YMKQBKT0KoOP6oXodWt0Oj3OAmrurWnsbG5uhynMEMUcs2v60FkgzZMPxKF9GpLQ0rhh6FRNzzML2B2ArPPZAFEpNNft7rBQ/0gLYUZ3vJwP8COOMVqx4LxLzFm4C0NajqYDJOmErF173iaWyCBDg6mL8lU4BCFbPFUN6AU0IwjwexP4m+55+luANGzpEkWkdwoMsqyRDXEKVj1Khll0qgHlqkGFHAuGuQg+uIF85ssVQ601bCaN8kgL1FEl+XKASu5kISLkHoDTb3HksXAKTxLwoVp9CPLFgMdOKJgCdL2BvdZOh8oBWoqSbACe/TtYYts0EEjiFQiFkUNfsAW6cBAgyKeZgVckXRzpUEHjCTggpQGCmmxlYyoqSy21EAScEXo91OvgdIk10QauKEHbbacR2SCbQzKdV+oTKOvxDTEwZ7Id9RDtp4CD3bQMOW+lCUJv8FcGtIg30SDjrETj+ICUNEuv+jVzLj/pkXgLkjH9GKoG9+xIEt8WcrW8AAAAABJRU5ErkJggg=='

})

public green_icon : L.icon = L.icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHNSURBVFhH3VZbSgMxFHUp7sFk/HUPM+Jvd6JJdSOiUorgJvwQqQiuwC/ftdbaKmqt506v0g7XeSZT8MCBMpOcc3N6k8nSv0Fk9CX/XAwiq4/BSdhcWeNH9YMKQBKT0KoOP6oXodWt0Oj3OAmrurWnsbG5uhynMEMUcs2v60FkgzZMPxKF9GpLQ0rhh6FRNzzML2B2ArPPZAFEpNNft7rBQ/0gLYUZ3vJwP8COOMVqx4LxLzFm4C0NajqYDJOmErF173iaWyCBDg6mL8lU4BCFbPFUN6AU0IwjwexP4m+55+luANGzpEkWkdwoMsqyRDXEKVj1Khll0qgHlqkGFHAuGuQg+uIF85ssVQ601bCaN8kgL1FEl+XKASu5kISLkHoDTb3HksXAKTxLwoVp9CPLFgMdOKJgCdL2BvdZOh8oBWoqSbACe/TtYYts0EEjiFQiFkUNfsAW6cBAgyKeZgVckXRzpUEHjCTggpQGCmmxlYyoqSy21EAScEXo91OvgdIk10QauKEHbbacR2SCbQzKdV+oTKOvxDTEwZ7Id9RDtp4CD3bQMOW+lCUJv8FcGtIg30SDjrETj+ICUNEuv+jVzLj/pkXgLkjH9GKoG9+xIEt8WcrW8AAAAABJRU5ErkJggg=='

})
    public myIcon: L.icon = null;
    constructor(
      
        private eventService: EventService,
        private operationService: OperationService,
        private alert: AlertService,
        private inventoryService: InventoryService

        ) {}

    ngOnInit(): void {
    
        

        this.mymap = L.map('mapid').setView([25.0694489560748, 55.1361319439252], 7);

        console.log('I am here')

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'sk.eyJ1IjoiY2V3OTc2NSIsImEiOiJja3N1aGpvZHIwMjloMm9wdDh2ZnNkbWtiIn0.kmUh2ED3rl3LQAygquxr3w'
        }).addTo(this.mymap);

       
        const query = {name: '* Substation'};
        const filter: object = {
            pageSize: 10000,
            withTotalPages: true
        };
        this.inventoryService.listQueryDevices( query, filter)
            .then(result => {
                console.log(result.data)
        this.devices = result.data;
        let i = 0;
        for (i=0; i<this.devices.length; i++)
        {

            console.log(this.devices[i].c8y_Position)

            let device: IManagedObject = this.devices[i]
            
            this.device_markers[device.id] ={marker: null, popupstring: null}
            let url =""
            if(device.name =='Secondary Substation')
            {
                url = `https://iotdewa.rnd.ae/apps/app-builder/index.html#/application/49/dashboard/33725/device/33702`
                this.myIcon = this.blueIcon;
            }
            else
            {
             url = `https://iotdewa.rnd.ae/apps/app-builder/index.html#/application/49/dashboard/33725/device/33702`
             this.myIcon = this.green_icon;
             
 
            }

            this.device_markers[device.id].marker = L.marker([device.c8y_Position.lat, device.c8y_Position.lng],  {icon: this.myIcon})
           /*
           let  active_alarms_critical = device.c8y_ActiveAlarmsStatus.critical || 0
           let  active_alarms_major = device.c8y_ActiveAlarmsStatus.major || 0
           let  active_alarms_minor = device.c8y_ActiveAlarmsStatus.minor || 0
           let  active_alarms_warning = device.c8y_ActiveAlarmsStatus.warning || 0
          
           let active_alarms = active_alarms_critical + active_alarms_major + active_alarms_minor + active_alarms_warning
           */
          let active_alarms = 3
            let ppstring =  `<div class=\"card\" style=\"width: 150px; background-color: white; color: black;\">             
            <div class=\"card-body\"><br><h4 class=\"card-title\"></h4> 
                <hr style = \"margin-top: 2px; margin-bottom: 2px;\"> 
                <dl>
                    <dt>Name</dt>
                    <dd >`+device.name+`</dd>
                    <hr style = \"margin-top: 2px; margin-bottom: 2px;\">
                    <dt >Last Inspection Date</dt>
                    <dd class=>` + device.lastInspectionDate + `</dd>                      
                    <hr style = \"margin-top: 2px; margin-bottom: 2px;\">
                    <dt translate=\"\">Active Alarms</dt>
                    <dd><span class = \"text-warning\">` + active_alarms + `</span></dd>
                    <hr style = \"margin-top: 2px; margin-bottom: 2px;\">
                    <a href = \"`+ url +`\" class=\"card-link\">Access Dashboard</a>
                </dl></div></div>`;

            this.device_markers[device.id].marker.addTo(this.mymap);

            this.device_markers[device.id].marker.bindPopup(ppstring);
        }
        
    
    });
}

}
