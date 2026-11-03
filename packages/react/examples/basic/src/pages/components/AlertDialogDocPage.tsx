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
      tocItems={[
        { id: 'overview', title: t('showcase.interactiveOverview', 'Interactive Overview') },
        { id: 'installation', title: t('showcase.installation', 'Installation') },
        { id: 'animations', title: t('showcase.animations', 'Animations') },
        { id: 'keyboard', title: t('showcase.keyboardNavigation', 'Keyboard Navigation') },
        { id: 'props', title: t('showcase.propsReference', 'Props Reference') },
      ]}
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
            <AlertDialogContent>
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
                <AlertDialogAction onClick={handleConfirm}>
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

      <section id="installation" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('showcase.installation', 'Installation')}</DocText>
        <div className="mt-4 rounded-lg border border-border bg-card p-4 font-mono text-xs">
          <code>npm install @chahu/cha-set</code>
        </div>
      </section>

      <DocMarkdown id="alert-dialog" section="animations" />
      <DocMarkdown id="alert-dialog" section="keyboard" />
      <DocMarkdown id="alert-dialog" section="props" />
    </DocLayout>
  );
}
