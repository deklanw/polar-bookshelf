import { PersistenceLayer } from '../../datastore/PersistenceLayer';
import { ipcRenderer } from 'electron';
import { Logger } from '../../logger/Logger';
import { FileImportRequest } from '../main/MainAppController';
import { ImportedFile, PDFImporter } from './importers/PDFImporter';
import { ProgressBar } from '../../ui/progress_bar/ProgressBar';
import { ProgressCalculator } from '../../util/ProgressCalculator';
import { IEventDispatcher } from '../../reactor/SimpleReactor';
import { IDocInfo } from '../../metadata/DocInfo';
import { Optional } from '../../util/ts/Optional';
import { DocLoader } from '../main/ipc/DocLoader';
import { FilePaths } from '../../util/FilePaths';
import { isPresent } from '../../Preconditions';
import { Toaster } from '../../ui/toaster/Toaster';
import { IProvider } from '../../util/Providers';
import { DeterminateProgressBar } from '../../ui/progress_bar/DeterminateProgressBar';

const log = Logger.create();

/**
 * Handles performing imports into the datastore when users select files from
 * the import dialog.
 *
 * @ElectronRendererContext
 */
export class FileImportController {
    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    private readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    private readonly pdfImporter: PDFImporter;

    constructor(
        persistenceLayerProvider: IProvider<PersistenceLayer>,
        updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>
    ) {
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.updatedDocInfoEventDispatcher = updatedDocInfoEventDispatcher;
        this.pdfImporter = new PDFImporter(persistenceLayerProvider);
    }

    public start(): void {
        log.info('File import controller started');

        ipcRenderer.on(
            'file-import',
            (event: any, fileImportRequest: FileImportRequest) => {
                this.onFileImportRequest(fileImportRequest).catch(err =>
                    log.error('Unable to import: ', err)
                );
            }
        );

        document.body.addEventListener('dragenter', event =>
            this.onDragEnterOrOver(event)
        );
        document.body.addEventListener('dragover', event =>
            this.onDragEnterOrOver(event)
        );
        document.body.addEventListener('drop', event => this.onDrop(event));
    }

    private onDragEnterOrOver(event: DragEvent) {
        // needed to tell the browser that onDrop is supported here...
        event.preventDefault();
    }

    private onDrop(event: DragEvent) {
        if (event.dataTransfer) {
            const files = Array.from(event.dataTransfer.files)
                .filter(file => file.path.endsWith('.pdf'))
                .map(file => file.path);

            this.onImportFiles(files).catch(err =>
                log.error('Unable to import files: ', files)
            );
        }
    }

    private async onFileImportRequest(fileImportRequest: FileImportRequest) {
        if (
            !isPresent(fileImportRequest.files) ||
            fileImportRequest.files.length === 0
        ) {
            // do not attempt an import if no files are given.  This way the
            // progress bar doesn't flash \and then vanish again.
            return;
        }

        await this.onImportFiles(fileImportRequest.files);
    }

    private async onImportFiles(files: string[]) {
        const importedFiles = await this.doImportFiles(files);

        if (importedFiles.length === 0) {
            // nothing to do here...
            return;
        }

        if (importedFiles.length === 1) {
            const importedFile = importedFiles[0];

            if (importedFile.isPresent()) {
                const file = importedFile.get();
                const fingerprint = file.docInfo.fingerprint;
                const path = file.stashFilePath;

                DocLoader.load({
                    fingerprint,
                    filename: FilePaths.basename(path),
                    newWindow: true,
                }).catch(err => log.error('Unable to load doc: ', err));
            }
        } else {
            Toaster.success(`Imported ${files.length} files successfully.`);
        }
    }

    private async doImportFiles(
        files: string[]
    ): Promise<Array<Optional<ImportedFile>>> {
        const progress = new ProgressCalculator(files.length);

        const result: Array<Optional<ImportedFile>> = [];

        try {
            for (const file of files) {
                try {
                    const importedFile = await this.doImportFile(file);
                    result.push(importedFile);
                } catch (e) {
                    log.error('Failed to import file: ' + file, e);
                } finally {
                    progress.incr();

                    DeterminateProgressBar.update(progress.percentage());
                }
            }

            return result;
        } finally {
        }
    }

    private async doImportFile(file: string): Promise<Optional<ImportedFile>> {
        log.info('Importing file: ' + file);

        const importedFileResult = await this.pdfImporter.importFile(file);

        importedFileResult.map(importedFile => {
            this.updatedDocInfoEventDispatcher.dispatchEvent(
                importedFile.docInfo
            );
        });

        return importedFileResult;
    }
}
