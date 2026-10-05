#pragma once

#include <QQuickPaintedItem>
#include <QColor>
#include <QPainterPath>
#include <QtQml/qqmlregistration.h>

class ChaSetSquirclePen : public QObject
{
    Q_OBJECT
    Q_PROPERTY(qreal width READ width WRITE setWidth NOTIFY changed)
    Q_PROPERTY(QColor color READ color WRITE setColor NOTIFY changed)
    QML_ANONYMOUS

public:
    explicit ChaSetSquirclePen(QObject *parent = nullptr);

    qreal width() const { return m_width; }
    void setWidth(qreal w);

    QColor color() const { return m_color; }
    void setColor(const QColor &c);

signals:
    void changed();

private:
    qreal m_width = 0.0;
    QColor m_color = Qt::transparent;
};

class ChaSetSquircle : public QQuickPaintedItem
{
    Q_OBJECT
    QML_NAMED_ELEMENT(ChaSetSquircleBase)
    QML_ADDED_IN_VERSION(1, 0)

    Q_PROPERTY(QColor color READ color WRITE setColor NOTIFY colorChanged)
    Q_PROPERTY(qreal radius READ radius WRITE setRadius NOTIFY radiusChanged)
    Q_PROPERTY(qreal topLeftRadius READ topLeftRadius WRITE setTopLeftRadius NOTIFY topLeftRadiusChanged)
    Q_PROPERTY(qreal topRightRadius READ topRightRadius WRITE setTopRightRadius NOTIFY topRightRadiusChanged)
    Q_PROPERTY(qreal bottomLeftRadius READ bottomLeftRadius WRITE setBottomLeftRadius NOTIFY bottomLeftRadiusChanged)
    Q_PROPERTY(qreal bottomRightRadius READ bottomRightRadius WRITE setBottomRightRadius NOTIFY bottomRightRadiusChanged)
    Q_PROPERTY(qreal cornerSmoothing READ cornerSmoothing WRITE setCornerSmoothing NOTIFY cornerSmoothingChanged)
    Q_PROPERTY(ChaSetSquirclePen *border READ border CONSTANT)

    Q_PROPERTY(bool roundLeft READ roundLeft WRITE setRoundLeft NOTIFY roundLeftChanged)
    Q_PROPERTY(bool roundRight READ roundRight WRITE setRoundRight NOTIFY roundRightChanged)
    Q_PROPERTY(bool roundTop READ roundTop WRITE setRoundTop NOTIFY roundTopChanged)
    Q_PROPERTY(bool roundBottom READ roundBottom WRITE setRoundBottom NOTIFY roundBottomChanged)
    Q_PROPERTY(bool roundTopLeft READ roundTopLeft WRITE setRoundTopLeft NOTIFY roundTopLeftChanged)
    Q_PROPERTY(bool roundTopRight READ roundTopRight WRITE setRoundTopRight NOTIFY roundTopRightChanged)
    Q_PROPERTY(bool roundBottomLeft READ roundBottomLeft WRITE setRoundBottomLeft NOTIFY roundBottomLeftChanged)
    Q_PROPERTY(bool roundBottomRight READ roundBottomRight WRITE setRoundBottomRight NOTIFY roundBottomRightChanged)

public:
    explicit ChaSetSquircle(QQuickItem *parent = nullptr);
    ~ChaSetSquircle() override = default;

    void paint(QPainter *painter) override;

    QColor color() const { return m_color; }
    void setColor(const QColor &c);

    qreal radius() const { return m_radius; }
    void setRadius(qreal r);

    qreal topLeftRadius() const { return m_topLeftRadius; }
    void setTopLeftRadius(qreal r);

    qreal topRightRadius() const { return m_topRightRadius; }
    void setTopRightRadius(qreal r);

    qreal bottomLeftRadius() const { return m_bottomLeftRadius; }
    void setBottomLeftRadius(qreal r);

    qreal bottomRightRadius() const { return m_bottomRightRadius; }
    void setBottomRightRadius(qreal r);

    qreal cornerSmoothing() const { return m_cornerSmoothing; }
    void setCornerSmoothing(qreal s);

    ChaSetSquirclePen *border() { return &m_pen; }

    bool roundLeft() const { return m_roundLeft; }
    void setRoundLeft(bool v);

    bool roundRight() const { return m_roundRight; }
    void setRoundRight(bool v);

    bool roundTop() const { return m_roundTop; }
    void setRoundTop(bool v);

    bool roundBottom() const { return m_roundBottom; }
    void setRoundBottom(bool v);

    bool roundTopLeft() const { return m_roundTopLeft; }
    void setRoundTopLeft(bool v);

    bool roundTopRight() const { return m_roundTopRight; }
    void setRoundTopRight(bool v);

    bool roundBottomLeft() const { return m_roundBottomLeft; }
    void setRoundBottomLeft(bool v);

    bool roundBottomRight() const { return m_roundBottomRight; }
    void setRoundBottomRight(bool v);

    static QPainterPath createSquirclePath(
        const QRectF &rect,
        qreal rTL, qreal rTR, qreal rBR, qreal rBL,
        qreal smoothing,
        bool tl = true, bool tr = true, bool br = true, bool bl = true
    );

signals:
    void colorChanged();
    void radiusChanged();
    void topLeftRadiusChanged();
    void topRightRadiusChanged();
    void bottomLeftRadiusChanged();
    void bottomRightRadiusChanged();
    void cornerSmoothingChanged();
    void roundLeftChanged();
    void roundRightChanged();
    void roundTopChanged();
    void roundBottomChanged();
    void roundTopLeftChanged();
    void roundTopRightChanged();
    void roundBottomLeftChanged();
    void roundBottomRightChanged();

private:
    QColor m_color = Qt::transparent;
    qreal m_radius = 0.0;
    qreal m_topLeftRadius = -1.0;
    qreal m_topRightRadius = -1.0;
    qreal m_bottomLeftRadius = -1.0;
    qreal m_bottomRightRadius = -1.0;
    qreal m_cornerSmoothing = 0.6; // Apple iOS continuous corner standard

    bool m_roundLeft = true;
    bool m_roundRight = true;
    bool m_roundTop = true;
    bool m_roundBottom = true;
    bool m_roundTopLeft = true;
    bool m_roundTopRight = true;
    bool m_roundBottomLeft = true;
    bool m_roundBottomRight = true;

    ChaSetSquirclePen m_pen{this};
};

class ChaSetSmoothRectangle : public ChaSetSquircle
{
    Q_OBJECT
    QML_NAMED_ELEMENT(ChaSetSmoothRectangle)
    QML_ADDED_IN_VERSION(1, 0)
public:
    using ChaSetSquircle::ChaSetSquircle;
};
