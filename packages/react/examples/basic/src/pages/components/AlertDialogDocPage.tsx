import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function AlertDialogDocPage() {
  const { t } = useChaSetI18n();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);

  const handleConfirm = () => {
    setStatus(t('overlays.alertDialog.statusMessage', 'Database was permanently removed.'));
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const heroReactCode = `<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">
      ${t('overlays.alertDialog.openAlertDialog', 'Open Alert Dialog')}
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        ${t('overlays.alertDialog.deleteDatabase', 'Delete Database Permanently')}
      </AlertDialogTitle>
      <AlertDialogDescription>
        ${t('overlays.alertDialog.deleteDatabaseDesc', 'This action cannot be undone. This database and all associated tables, indexes, and backups will be immediately eradicated.')}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>
        ${t('overlays.alertDialog.cancel', 'Cancel')}
      </AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirm}>
        ${t('overlays.alertDialog.confirm', 'Confirm Delete')}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;

  const heroQtCode = `ChaSetAlertDialog {
    id: alertDialog
    title: "${t('overlays.alertDialog.deleteDatabase', 'Delete Database Permanently')}"
    description: "${t('overlays.alertDialog.deleteDatabaseDesc', 'This action cannot be undone. This database and all associated tables, indexes, and backups will be immediately eradicated.')}"
    confirmText: "${t('overlays.alertDialog.confirm', 'Confirm Delete')}"
    cancelText: "${t('overlays.alertDialog.cancel', 'Cancel')}"
    onConfirmed: {
        console.log("Database permanently removed")
    }
}`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Alert Dialog"
      description={t(
        'components.alertDialog.description',
        'Modal dialog that interrupts the user with important, critical, or destructive confirmations.',
      )}
    >
      <DocText id="overview-desc" className="text-muted-foreground text-sm mb-4">
        {t(
          'overlays.alertDialog.overviewDesc',
          'Modal dialog that interrupts the user with important, critical, or destructive confirmations.',
        )}
      </DocText>

      <ComponentPreview
        title={t('overlays.alertDialog.sandboxTitle', 'Alert Dialog Sandbox')}
        reactCode={heroReactCode}
        qtCode={heroQtCode}
      >
        <div className="flex flex-col items-center gap-4">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                {t('overlays.alertDialog.openAlertDialog', 'Open Alert Dialog')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('overlays.alertDialog.deleteDatabase', 'Delete Database Permanently')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    'overlays.alertDialog.deleteDatabaseDesc',
                    'This action cannot be undone. This database and all associated tables, indexes, and backups will be immediately eradicated.',
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancel}>
                  {t('overlays.alertDialog.cancel', 'Cancel')}
                </AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleConfirm}>
                  {t('overlays.alertDialog.confirm', 'Confirm Delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {status && (
            <div className="text-xs text-muted-foreground p-2 rounded-md bg-muted/40 border border-border">
              {status}
            </div>
          )}
        </div>
      </ComponentPreview>

      <DocAnatomy
        id="anatomy"
        reactCode={`import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  Button
} from '@chahu/cha-set';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Item</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
        qtCode={`import ChaSet

ChaSetAlertDialog {
    title: "Delete Item"
    description: "This action cannot be undone."
    confirmText: "Delete"
    cancelText: "Cancel"
    onConfirmed: console.log("confirmed")
}`}
      />

      <DocMarkdown id="alert-dialog" section="animations" />
      <DocMarkdown id="alert-dialog" section="keyboard" />
      <DocMarkdown id="alert-dialog" section="props" />
    </DocLayout>
  );
}
