import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Activity {
    avatar: string
    initials: string
    user: string
    action: string
    target?: string
    time: string
}

// In a real app, we would fetch this from the database
const activities: Activity[] = []

export function RecentActivity() {
    return (
        <Card className="col-span-4 lg:col-span-3 bg-card border-border">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions taken by users.</CardDescription>
            </CardHeader>
            <CardContent>
                {activities.length > 0 ? (
                    <div className="space-y-8">
                        {activities.map((activity, index) => (
                            <div key={index} className="flex items-center">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={activity.avatar} alt="Avatar" />
                                    <AvatarFallback className="bg-primary/10 text-primary uppercase text-xs font-bold">
                                        {activity.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none text-foreground">
                                        {activity.user}
                                        <span className="text-muted-foreground font-normal ml-1">
                                            {activity.action} {activity.target && <span className="text-foreground font-medium"> {activity.target}</span>}
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground text-center py-8">
                        No recent activity to display.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
