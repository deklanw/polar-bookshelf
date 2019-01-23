import { TriggerEvent } from '../TriggerEvent';
import { WebContents, Menu, MenuItem, BrowserWindow, ipcMain } from 'electron';
import { Logger } from '../../logger/Logger';
import PopupOptions = Electron.PopupOptions;
import { Arrays } from '../../util/Arrays';
import { Broadcaster } from '../../ipc/Broadcaster';
import { Preconditions } from '../../Preconditions';
import { ContextMenuType } from '../ContextMenuType';
import { Messenger } from '../../electron/messenger/Messenger';
import { AnnotationSidebarClient } from '../../annotation_sidebar/AnnotationSidebarClient';

const log = Logger.create();

/**
 * Careful here as this is confusing.  We're using the REMOVE interface so the
 * context changes. This code is triggered from the renderer but then runs
 * in the main process.
 *
 * @ElectronMainContext
 */
export class ElectronContextMenu {
    constructor() {
        // TODO: move this to a start method.
        ipcMain.on(
            'context-menu-trigger',
            (event: Electron.Event, message: any) => {
                const triggerEvent = TriggerEvent.create(message);

                this.trigger(triggerEvent, event.sender);
            }
        );

        // noinspection TsLint: no-unused-expression
        new Broadcaster('create-annotation');
    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     */
    public trigger(triggerEvent: TriggerEvent, sender: WebContents) {
        Preconditions.assertNotNull(sender, 'sender');

        const window = BrowserWindow.getFocusedWindow();

        const ctxMenu = this.createContextMenu(triggerEvent, sender);

        // The documentation for this looks wrong and it actually takes three
        // arguments not a object. Note that we should NOT include the mouse
        // point as by default it uses the mouse point anyway which is almost
        // always what we want.
        ctxMenu.popup(<PopupOptions>{
            window,
        });
    }

    private async postContextMenuMessage(
        name: string,
        triggerEvent: TriggerEvent
    ) {
        log.info('postContextMenuMessage: ' + name);

        // TODO: this should use its own type of ContextMenuMessage with the
        // ContextMenuLocation and a type field.

        // TODO: just send the full TriggerEvent but rename it to
        // ContextMenuSelectedEvent or something along those lines.

        await Messenger.postMessage({
            message: {
                type: name,
                point: triggerEvent.point,
                points: triggerEvent.points,
                pageNum: triggerEvent.pageNum,
                matchingSelectors: triggerEvent.matchingSelectors,
                docDescriptor: triggerEvent.docDescriptor,
            },
        });
    }

    /**
     * Send the annotation BACK to the sender with the specific actions to take.
     *
     * @deprecated Move to postContextMenuMessage
     * @param command
     * @param triggerEvent
     * @param sender
     */
    private cmdNotify(
        command: string,
        triggerEvent: TriggerEvent,
        sender: WebContents
    ) {
        // we're sending back LESS data because I think all of the original data
        // is probably not needed.
        const event = {
            command,
            matchingSelectors: triggerEvent.matchingSelectors,
            docDescriptor: triggerEvent.docDescriptor,
        };

        sender.send('context-menu-command', event);
    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     */
    private createContextMenu(triggerEvent: TriggerEvent, sender: WebContents) {
        Preconditions.assertNotNull(sender, 'sender');

        // TODO: move this to a template as the code is cleaner

        const contextMenus: Menu[] = [];

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGE)) {
            contextMenus.push(this.createPageContextMenu(triggerEvent, sender));
        }

        if (
            triggerEvent.contextMenuTypes.includes(
                ContextMenuType.TEXT_HIGHLIGHT
            )
        ) {
            contextMenus.push(
                this.createTextHighlightContextMenu(triggerEvent, sender)
            );
        }

        if (
            triggerEvent.contextMenuTypes.includes(
                ContextMenuType.AREA_HIGHLIGHT
            )
        ) {
            contextMenus.push(
                this.createAreaHighlightContextMenu(triggerEvent, sender)
            );
        }

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGEMARK)) {
            contextMenus.push(
                this.createPagemarkContextMenu(triggerEvent, sender)
            );
        }

        contextMenus.push(this.createDefaultContextMenu(triggerEvent, sender));

        const ctxMenu = new Menu();

        Arrays.createSiblings(contextMenus).forEach(contextMenuCursor => {
            contextMenuCursor.curr.items.forEach(menuItem => {
                ctxMenu.append(menuItem);
            });

            if (
                contextMenuCursor.curr.items.length > 0 &&
                contextMenuCursor.next
            ) {
                ctxMenu.append(
                    new MenuItem({
                        type: 'separator',
                    })
                );
            }
        });

        return ctxMenu;
    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    private createTextHighlightContextMenu(
        triggerEvent: TriggerEvent,
        sender: WebContents
    ): Menu {
        const ctxMenu = new Menu();

        ctxMenu.append(
            this.createSubmenu('Text Highlight', [
                // new MenuItem({
                //     label: 'Add Flashcard',
                //     // accelerator: 'CmdOrCtrl+A',
                //     click: () => this.postContextMenuMessage("add-flashcard", triggerEvent)
                // }),
                // new MenuItem({
                //     label: 'Add Comment',
                //     // accelerator: 'CmdOrCtrl+A',
                //     click: () => this.postContextMenuMessage("add-comment", triggerEvent)
                // }),
                new MenuItem({
                    label: 'Delete',
                    // accelerator: 'CmdOrCtrl+A',
                    click: () =>
                        this.cmdNotify(
                            'delete-text-highlight',
                            triggerEvent,
                            sender
                        ),
                }),
            ])
        );

        return ctxMenu;
    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    private createAreaHighlightContextMenu(
        triggerEvent: TriggerEvent,
        sender: WebContents
    ): Menu {
        const ctxMenu = new Menu();

        ctxMenu.append(
            this.createSubmenu('Area Highlight', [
                // new MenuItem({
                //     label: 'Add Flashcard',
                //     click: () => this.postContextMenuMessage("add-flashcard", triggerEvent)
                // }),
                // new MenuItem({
                //     label: 'Add Comment',
                //     // accelerator: 'CmdOrCtrl+A',
                //     click: () => this.postContextMenuMessage("add-comment", triggerEvent)
                // }),
                new MenuItem({
                    label: 'Delete',
                    // accelerator: 'CmdOrCtrl+A',
                    click: () =>
                        this.postContextMenuMessage(
                            'delete-area-highlight',
                            triggerEvent
                        ),
                }),
            ])
        );

        return ctxMenu;
    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    private createPagemarkContextMenu(
        triggerEvent: TriggerEvent,
        sender: WebContents
    ): Menu {
        const ctxMenu = new Menu();

        ctxMenu.append(
            this.createSubmenu('Pagemark', [
                new MenuItem({
                    label: 'Delete Pagemark',
                    // accelerator: 'CmdOrCtrl+A',
                    click: () =>
                        this.postContextMenuMessage(
                            'delete-pagemark',
                            triggerEvent
                        ),
                }),
            ])
        );

        return ctxMenu;
    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    private createPageContextMenu(
        triggerEvent: TriggerEvent,
        sender: WebContents
    ): Menu {
        const ctxMenu = new Menu();

        // TODO: page highlights don't work right now as we need an annotation
        // to base it off of.
        // ctxMenu.append(new MenuItem({
        //     label: 'Add Flashcard',
        //     //accelerator: 'CmdOrCtrl+A',
        //     click: () => this.postContextMenuMessage("add-flashcard", triggerEvent)
        // }));

        // ctxMenu.append(this.createSubmenu('Create Pagemark...', [
        //
        //     new MenuItem({
        //         label: '... To Point',
        //         click: () => this.postContextMenuMessage("create-pagemark-to-point", triggerEvent)
        //     }),
        //
        //     new MenuItem({
        //         label: '... Box At Point',
        //         click: () => this.postContextMenuMessage("create-pagemark", triggerEvent)
        //     }),
        //
        // ]));

        ctxMenu.append(
            new MenuItem({
                label: 'Create Pagemark to Point',
                // accelerator: "CommandOrControl+Alt+LeftClick",
                // registerAccelerator: false,
                click: () =>
                    this.postContextMenuMessage(
                        'create-pagemark-to-point',
                        triggerEvent
                    ),
            })
        );

        ctxMenu.append(
            new MenuItem({
                label: 'Create Pagemark Box',
                click: () =>
                    this.postContextMenuMessage(
                        'create-pagemark',
                        triggerEvent
                    ),
            })
        );

        ctxMenu.append(
            new MenuItem({
                label: 'Create Area Highlight',
                click: () =>
                    this.postContextMenuMessage(
                        'create-area-highlight',
                        triggerEvent
                    ),
            })
        );

        // ctxMenu.append(new MenuItem({
        //     label: 'Sync Flashcards to Anki',
        //     click: () => this.postContextMenuMessage("start-sync", triggerEvent)
        // }));

        // ctxMenu.append(new MenuItem({
        //     label: 'Create Annotation',
        //     click: () => this.postContextMenuMessage("create-annotation", triggerEvent)
        // }));

        return ctxMenu;
    }

    /**
     *
     * @param triggerEvent
     * @param sender
     * @return {Electron.Menu}
     */
    private createDefaultContextMenu(
        triggerEvent: TriggerEvent,
        sender: WebContents
    ): Menu {
        const ctxMenu = new Menu();

        // TODO: display this first and only if text is highlighted
        // ctxMenu.append(new MenuItem({ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' }));

        ctxMenu.append(
            new MenuItem({
                label: 'Toggle Annotation Sidebar',
                id: 'toggle-annotation-sidebar',
                click: () => AnnotationSidebarClient.toggleAnnotationSidebar(),
            })
        );

        ctxMenu.append(
            new MenuItem({
                label: 'Inspect Element',
                id: 'inspect',
                // accelerator: 'Ctrl+Shift+I',
                click: event => {
                    const window = BrowserWindow.getFocusedWindow();

                    if (!window) {
                        throw new Error('No current window');
                    }

                    // the points are SLIGHTLY off for the iframe version which is
                    // very annoying.
                    window.webContents.inspectElement(
                        triggerEvent.point.x,
                        triggerEvent.point.y
                    );

                    if (window.webContents.isDevToolsOpened()) {
                        window.webContents.devToolsWebContents.focus();
                    }
                },
            })
        );

        return ctxMenu;
    }

    public createSubmenu(label: string, menuItems: MenuItem[]): MenuItem {
        const submenu = new Menu();

        const submenuItem = new MenuItem({
            label,
            type: 'submenu',
            submenu,
        });

        menuItems.forEach(menuItem => {
            submenu.append(menuItem);
        });

        return submenuItem;
    }
}
