import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Props = {
    show: boolean;
    countdown: number;
    progress: number;
    onStay: () => void;
};

export default function SessionWarningModal({
    show,
    countdown,
    progress,
    onStay,
}: Props) {
    return (
        <AlertDialog open={show} onOpenChange={() => {}}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">
                        Session Expiring
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        You will be logged out in{' '}
                        <span className="font-semibold text-red-600">
                            {countdown}
                        </span>{' '}
                        seconds.
                    </AlertDialogDescription>

                    {/* 🚀 SMOOTH GOOGLE-STYLE BAR */}
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-2 rounded-full bg-red-500"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogAction
                        className="w-full"
                        onClick={() => {
                            onStay();
                        }}
                    >
                        Stay Logged In
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
