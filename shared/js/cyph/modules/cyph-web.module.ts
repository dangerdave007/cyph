import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {
	MdButtonModule,
	MdButtonToggleModule,
	MdCardModule,
	MdDialogModule,
	MdIconModule,
	MdInputModule,
	MdListModule,
	MdMenuModule,
	MdProgressBarModule,
	MdProgressSpinnerModule,
	MdSelectModule,
	MdSlideToggleModule,
	MdSnackBarModule,
	MdTabsModule,
	MdTooltipModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {
	SmdFabSpeedDialActions,
	SmdFabSpeedDialComponent,
	SmdFabSpeedDialTrigger
} from 'angular-smd/src/app/shared/component/smd-fab-speed-dial';
import {DialogAlertComponent} from '../components/dialog-alert.component';
import {DialogConfirmComponent} from '../components/dialog-confirm.component';
import {DialogImageComponent} from '../components/dialog-image.component';
import {NanoScrollerDirective} from '../directives/nano-scroller.directive';
import {DialogService} from '../services/dialog.service';
import {LocalStorageService} from '../services/local-storage.service';
import {MaterialDialogService} from '../services/material-dialog.service';
import {WebLocalStorageService} from '../services/web-local-storage.service';


/**
 * Common module with shared imports for web projects.
 */
@NgModule({
	declarations: [
		DialogAlertComponent,
		DialogConfirmComponent,
		DialogImageComponent,
		NanoScrollerDirective,
		SmdFabSpeedDialActions,
		SmdFabSpeedDialComponent,
		SmdFabSpeedDialTrigger
	],
	exports: [
		BrowserAnimationsModule,
		BrowserModule,
		DialogAlertComponent,
		DialogConfirmComponent,
		DialogImageComponent,
		FlexLayoutModule,
		FormsModule,
		MdButtonModule,
		MdButtonToggleModule,
		MdCardModule,
		MdDialogModule,
		MdIconModule,
		MdInputModule,
		MdListModule,
		MdMenuModule,
		MdProgressBarModule,
		MdProgressSpinnerModule,
		MdSelectModule,
		MdSlideToggleModule,
		MdSnackBarModule,
		MdTabsModule,
		MdTooltipModule,
		NanoScrollerDirective,
		RouterModule,
		SmdFabSpeedDialActions,
		SmdFabSpeedDialComponent,
		SmdFabSpeedDialTrigger
	],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		FlexLayoutModule,
		FormsModule,
		MdButtonModule,
		MdCardModule,
		MdDialogModule,
		MdIconModule,
		MdInputModule,
		MdListModule,
		MdMenuModule,
		MdProgressBarModule,
		MdProgressSpinnerModule,
		MdSelectModule,
		MdSlideToggleModule,
		MdSnackBarModule,
		MdTabsModule,
		MdTooltipModule,
		RouterModule
	],
	providers: [
		{
			provide: DialogService,
			useClass: MaterialDialogService
		},
		{
			provide: LocalStorageService,
			useClass: WebLocalStorageService
		}
	]
})
/* tslint:disable-next-line:no-stateless-class */
export class CyphWebModule {
	constructor () {}
}
