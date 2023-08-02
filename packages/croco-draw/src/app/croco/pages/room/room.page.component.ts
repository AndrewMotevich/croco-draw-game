import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IPlayer, UserOrder } from '@croco/../libs/croco-common-interfaces';

@Component({
  selector: 'croco-room.page',
  templateUrl: './room.page.component.html',
  styleUrls: ['./room.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomPageComponent {
  roomName = 'Unknown';

  cols = [
    { field: 'order', header: 'Order' },
    { field: 'name', header: 'Name' },
    { field: 'host', header: 'Host' },
    { field: 'score', header: 'Score' },
    { field: 'ready', header: 'Ready' },
  ];

  items: IPlayer[] = [
    {
      host: true,
      name: 'Andrew',
      order: UserOrder.first,
      ready: false,
      score: 0,
    },
    {
      host: false,
      name: 'Sofia',
      order: UserOrder.second,
      ready: false,
      score: 0,
    },
  ];
}
